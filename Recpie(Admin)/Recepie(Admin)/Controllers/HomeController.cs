using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Recepie_Admin_.Models;
using Recepie_Admin_.DBContext;

namespace Recepie_Admin_.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly MyDbContext _dbContext;

        public HomeController(ILogger<HomeController> logger, MyDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        // ---------------------- LOGIN ----------------------
        [HttpGet]
        public IActionResult Login()
        {
            // If already logged in, redirect to dashboard
            if (HttpContext.Session.GetInt32("UserId") != null)
                return RedirectToAction("ListingPage", "Home");

            return View();
        }

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == email && u.Password == password);
            if (user == null)
            {
                ViewBag.Error = "Invalid email or password.";
                return View();
            }

            if (user.IsAdmin == true)
            {
                // ✅ Store in session
                HttpContext.Session.SetInt32("UserId", user.Id);
                HttpContext.Session.SetString("Username", user.Username);
                HttpContext.Session.SetString("Email", user.Email);
                HttpContext.Session.SetString("Role", "Admin");

                return RedirectToAction("ListingPage", "Home");
            }

            ViewBag.Error = "You are not authorized to access the admin panel.";
            return View();
        }

        // ---------------------- LISTING PAGE ----------------------
        public IActionResult ListingPage(int page = 1)
        {
            if (!IsAdminSessionActive())
                return RedirectToAction("Login", "Home");

            int pageSize = 5;
            var totalItems = _dbContext.Recipes.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            var recipes = _dbContext.Recipes
                .Include(r => r.User)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            return View(recipes);
        }


        // ---------------------- USER LIST ----------------------
        public IActionResult UserList(int page = 1)
        {
            if (!IsAdminSessionActive())
                return RedirectToAction("Login", "Home");

            int pageSize = 5;
            var totalItems = _dbContext.Users.Count(u => !u.IsAdmin);
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            var users = _dbContext.Users
                .Where(u => u.IsAdmin == false)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            return View(users);
        }

        // ---------------------- MOST VIEWED ----------------------
        public async Task<IActionResult> MostViewed(int page = 1)
        {
            if (!IsAdminSessionActive())
                return RedirectToAction("Login", "Home");

            int pageSize = 5;
            var totalItems = _dbContext.Recipes.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            var recipes = await _dbContext.Recipes
                .OrderByDescending(r => r.ViewCount)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            return View(recipes);
        }

        // ---------------------- USER PROFILE ----------------------
        public IActionResult UserProfile(int id)
        {
            if (!IsAdminSessionActive())
                return RedirectToAction("Login", "Home");

            var recipes = _dbContext.Recipes
                .Where(r => r.AuthorId == id)
                .ToList();

            return View(recipes);
        }

        // ---------------------- RECIPE DETAILS ----------------------
        public IActionResult ViewDetails(int id)
        {
            if (!IsAdminSessionActive())
                return RedirectToAction("Login", "Home");

            var recipe = _dbContext.Recipes
                .Include(r => r.User)
                .FirstOrDefault(r => r.Id == id);

            if (recipe == null)
                return NotFound();

            return View(recipe);
        }

        // ---------------------- TOGGLE USER STATUS ----------------------
        [HttpPost]
        public IActionResult ToggleUserStatus(int id)
        {
            if (!IsAdminSessionActive())
                return RedirectToAction("Login", "Home");

            var user = _dbContext.Users.Find(id);
            if (user == null)
            {
                TempData["ErrorMessage"] = "User not found.";
                return RedirectToAction("UserList");
            }

            if (user.IsAdmin)
            {
                TempData["ErrorMessage"] = "Admin account cannot be blocked/unblocked.";
                return RedirectToAction("UserList");
            }

            user.IsActive = !user.IsActive;
            _dbContext.SaveChanges();

            TempData["SuccessMessage"] = user.IsActive
                ? "User unblocked successfully."
                : "User blocked successfully.";

            return RedirectToAction("UserList");
        }

        // ---------------------- LOGOUT ----------------------
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            HttpContext.Response.Cookies.Delete(".AspNetCore.Session");
            return RedirectToAction("Login", "Home");
        }

        // ---------------------- PRIVACY + ERROR ----------------------
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        // ---------------------- PRIVATE HELPER ----------------------
        private bool IsAdminSessionActive()
        {
            var role = HttpContext.Session.GetString("Role");
            return !string.IsNullOrEmpty(role) && role == "Admin";
        }
    }
}
