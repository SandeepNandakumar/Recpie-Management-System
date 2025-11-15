using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Recepie_Admin_.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(150)]
        public string Title { get; set; }

        [StringLength(255)]
        public string Image { get; set; }

        [Required(ErrorMessage = "Preparation time is required.")]
        public int PreparationTime { get; set; } // in minutes

        [Required(ErrorMessage = "Difficulty is required.")]
        [StringLength(50)]
        public string Difficulty { get; set; } // Easy, Medium, Hard

        [Required(ErrorMessage = "Ingredients are required.")]
        public string Ingredients { get; set; }

        [Required(ErrorMessage = "Steps are required.")]
        public string Steps { get; set; }

        // 👇 This now tracks how many times the recipe was viewed
        public int ViewCount { get; set; } = 0;

        // 🔗 Foreign Key for Author (linked to User)
        [Required]
        public int AuthorId { get; set; }

        [ForeignKey("AuthorId")]
        public User? User{ get; set; } // Navigation property
    }
}
