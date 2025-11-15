using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Recepie_Admin_.DBContext;
using Recepie_Admin_.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Recepie_Admin_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public UserController(MyDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        // ------------------- REGISTER -------------------
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (_dbContext.Users.Any(u => u.Username == user.Username || u.Email == user.Email))
                return BadRequest(new { message = "Username or email already exists" });

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        // ------------------- LOGIN -------------------
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            var dbUser = _dbContext.Users
                .FirstOrDefault(u => u.Username == loginModel.Username && u.Password == loginModel.Password);

            // ❌ 1. If user not found
            if (dbUser == null)
                return Unauthorized(new { message = "Invalid username or password" });

            // 🚫 2. If user is blocked (IsActive == false)
            if (!dbUser.IsActive)
                return Unauthorized(new { message = "Your account has been blocked by admin." });

            // ✅ Generate JWT token including user ID
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, dbUser.Id.ToString()),
            new Claim(ClaimTypes.Name, dbUser.Username),
            new Claim("IsAdmin", dbUser.IsAdmin.ToString())
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                userId = dbUser.Id,
                username = dbUser.Username,
                email = dbUser.Email,
                isAdmin = dbUser.IsAdmin
            });
        }
// ------------------- ADD RECIPE -------------------
[Authorize]
        [HttpPost("Add")]
        public async Task<IActionResult> AddRecipe([FromBody] Recipe recipe)
        {
            if (recipe == null)
                return BadRequest(new { message = "Invalid recipe data" });

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Invalid user token" });

            recipe.AuthorId = int.Parse(userIdClaim);
            _dbContext.Recipes.Add(recipe);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Recipe added successfully" });
        }

        // ------------------- GET RECIPES BY LOGGED-IN USER -------------------
        [Authorize]
        [HttpGet("user")]
        public IActionResult GetRecipesByAuthor()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Invalid user token" });

            int authorId = int.Parse(userIdClaim);
            var recipes = _dbContext.Recipes.Where(r => r.AuthorId == authorId).ToList();

            if (recipes.Count == 0)
                return NotFound(new { message = "No recipes found for this author" });

            return Ok(recipes);
        }

        // ------------------- UPDATE RECIPE -------------------
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe(int id, [FromBody] Recipe updatedRecipe)
        {
            var recipe = _dbContext.Recipes.Find(id);
            if (recipe == null)
                return NotFound(new { message = "Recipe not found" });

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || recipe.AuthorId != int.Parse(userIdClaim))
                return Unauthorized(new { message = "Not authorized to update this recipe" });

            recipe.Title = updatedRecipe.Title;
            recipe.Image = updatedRecipe.Image;
            recipe.PreparationTime = updatedRecipe.PreparationTime;
            recipe.Difficulty = updatedRecipe.Difficulty;
            recipe.Ingredients = updatedRecipe.Ingredients;
            recipe.Steps = updatedRecipe.Steps;

            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Recipe updated successfully" });
        }

        // ------------------- DELETE RECIPE -------------------
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = _dbContext.Recipes.Find(id);
            if (recipe == null)
                return NotFound(new { message = "Recipe not found" });

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || recipe.AuthorId != int.Parse(userIdClaim))
                return Unauthorized(new { message = "Not authorized to delete this recipe" });

            _dbContext.Recipes.Remove(recipe);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Recipe deleted successfully" });
        }
        [Authorize]
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            if (model == null)
                return BadRequest(new { message = "invalid data" });
            var username = User.Identity?.Name;
            var user = _dbContext.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
                return Unauthorized(new { message = "user not found" });
            if (user.Password != model.OldPassword)
                return BadRequest(new { message = "current password is incorrect" });
            user.Password = model.NewPassword;
            _dbContext.SaveChanges();
            return Ok(new { message = "password changed successfully" });
        }
        // ------------------- GET ALL RECIPES (FOR USER FEED) -------------------
        [Authorize]
        [HttpGet("GetAll")]
        public IActionResult GetAllRecipes()
        {
            var recipes = _dbContext.Recipes.ToList();

            if (recipes == null || recipes.Count == 0)
                return NotFound(new { message = "No recipes found" });

            return Ok(recipes);
        }
        [Authorize]
        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid recipe ID" });

            var recipe = await _dbContext.Recipes
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
                return NotFound(new { message = "Recipe not found" });

            return Ok(recipe);
        }
        [Authorize]
        [HttpPost("viewcount/{id}")]
        public async Task<IActionResult> ViewCount(int id)
        {
            var recipe = await _dbContext.Recipes.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null)
                return NotFound(new { message = "recpie not found" });
            recipe.ViewCount += 1;
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "viewcount updated", ViewCount = recipe.ViewCount });
        }
       

    }
}
