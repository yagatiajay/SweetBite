using SweetBite.API.Models;
using SweetBite.API.Services;

namespace SweetBite.API.Data;

public static class DbInitializer
{
    public static void Initialize(SweetBiteDbContext context)
    {
        context.Database.EnsureCreated();

        // Seed Admin Account if not exists
        if (!context.Users.Any(u => u.Email == "admin@sweetbite.com"))
        {
            var adminUser = new User
            {
                FullName = "Bakery Owner (Admin)",
                Email = "admin@sweetbite.com",
                PasswordHash = PasswordHasher.HashPassword("Admin123!"),
                Phone = "+1 (555) 321-CAKE",
                Address = "124 Bakery Lane, San Francisco, CA",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(adminUser);
            context.SaveChanges();
        }

        // Also ensure customer demo account exists
        if (!context.Users.Any(u => u.Email == "sarah@sweetbite.com"))
        {
            var customerUser = new User
            {
                FullName = "Sarah Connor",
                Email = "sarah@sweetbite.com",
                PasswordHash = PasswordHasher.HashPassword("Password123!"),
                Phone = "+1 555-432-1982",
                Address = "742 Evergreen Terrace, San Francisco, CA",
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(customerUser);
            context.SaveChanges();
        }

        if (context.Products.Any())
        {
            return; // DB products already seeded
        }

        var browniesCat = new Category { Name = "Brownies", Slug = "brownies", Description = "Dense, fudgy, and intensely chocolaty squares baked with 70% dark Belgian cocoa.", DisplayOrder = 1 };
        var cookiesCat = new Category { Name = "Cookies", Slug = "cookies", Description = "Crisp golden edges with melt-in-your-mouth chewy centers, finished with sea salt.", DisplayOrder = 2 };
        var cakesCat = new Category { Name = "Cakes", Slug = "cakes", Description = "Artisan layered sponge cakes adorned with fresh florals and silky Swiss buttercream.", DisplayOrder = 3 };
        var pastriesCat = new Category { Name = "Pastries", Slug = "pastries", Description = "Laminated French viennoiseries and delicate patisserie crafted with pure butter.", DisplayOrder = 4 };

        context.Categories.AddRange(browniesCat, cookiesCat, cakesCat, pastriesCat);
        context.SaveChanges();

        var products = new List<Product>
        {
            // Brownies
            new Product
            {
                Name = "Signature Fudgy Sea Salt Brownie",
                Slug = "signature-fudgy-sea-salt-brownie",
                Tagline = "Rich Belgian chocolate with flaky Maldon sea salt crystals",
                Description = "Our holy grail dessert: dense, chewy, and intensely rich brownie crafted with 72% Valrhona cocoa and topped with hand-harvested sea salt flakes to balance the sweetness.",
                Price = 4.50m,
                StockQuantity = 24,
                DiscountPercent = 0,
                CategoryId = browniesCat.Id,
                WeightOrServings = "1 Large Square (110g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = true,
                Rating = 4.9,
                ReviewCount = 184,
                ImageUrl = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Dark Cocoa • Sea Salt • Brown Butter Caramel",
                Ingredients = "Belgian 72% Cocoa, Normandy Butter, Farm-Fresh Eggs, Cane Sugar, Wheat Flour, Maldon Flaky Salt",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Salted Caramel Pretzel Brookie",
                Slug = "salted-caramel-pretzel-brookie",
                Tagline = "Half fudgy brownie, half chewy cookie with crunchy salted pretzel",
                Description = "Can't decide between a cookie and a brownie? Enjoy both in one glorious bite, drizzled with homemade slow-cooked amber caramel and pretzel crunch.",
                Price = 4.50m,
                OriginalPrice = 5.00m,
                DiscountPercent = 10,
                StockQuantity = 12,
                CategoryId = browniesCat.Id,
                WeightOrServings = "1 Brookie Bar (125g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = true,
                Rating = 4.8,
                ReviewCount = 96,
                ImageUrl = "https://images.unsplash.com/photo-1589218436045-ee320057f443?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Caramel • Toasted Pretzel • Semi-Sweet Chocolate",
                Ingredients = "Flour, Butter, Brown Sugar, Dark Chocolate, Salted Pretzels, Eggs, Heavy Cream, Sea Salt",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Midnight Espresso Hazelnut Brownie",
                Slug = "midnight-espresso-hazelnut-brownie",
                Tagline = "Dark roast espresso ganache with roasted Piedmont hazelnuts",
                Description = "Infused with freshly pulled arabica espresso, layered with silky dark ganache and loaded with crunchy roasted hazelnuts for true coffee and chocolate purists.",
                Price = 5.50m,
                StockQuantity = 4, // Low stock demo!
                DiscountPercent = 0,
                CategoryId = browniesCat.Id,
                WeightOrServings = "1 Large Square (120g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = false,
                Rating = 4.9,
                ReviewCount = 74,
                ImageUrl = "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Dark Roast Espresso • Roasted Hazelnut • Bitter Cocoa",
                Ingredients = "Cocoa, Butter, Roasted Hazelnuts, Espresso Extract, Cane Sugar, Eggs, Wheat Flour",
                Allergens = "Tree Nuts, Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Ruby Raspberry Ganache Brownie",
                Slug = "ruby-raspberry-ganache-brownie",
                Tagline = "Tart raspberry coulis ribboned through velvety dark fudge",
                Description = "Fresh organic raspberry reduction folded through warm bittersweet chocolate, finished with freeze-dried raspberry dusting.",
                Price = 5.25m,
                StockQuantity = 18,
                DiscountPercent = 0,
                CategoryId = browniesCat.Id,
                WeightOrServings = "1 Large Square (115g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = false,
                Rating = 4.9,
                ReviewCount = 61,
                ImageUrl = "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Tart Raspberry • Bittersweet Cocoa • Floral Vanilla",
                Ingredients = "Belgian Chocolate, Butter, Fresh Raspberries, Raw Sugar, Eggs, Cocoa Powder, Flour",
                Allergens = "Dairy, Gluten, Eggs"
            },

            // Cookies
            new Product
            {
                Name = "Brown Butter Chocolate Chunk Cookie",
                Slug = "brown-butter-chocolate-chunk-cookie",
                Tagline = "Nutty caramelized butter with molten dark chocolate pools",
                Description = "Slowly caramelized butter yields nutty toffee undertones, packed with hand-chopped 70% chocolate chunks and rested for 48 hours before baking.",
                Price = 3.80m,
                StockQuantity = 30,
                DiscountPercent = 0,
                CategoryId = cookiesCat.Id,
                WeightOrServings = "1 Jumbo Cookie (95g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = true,
                Rating = 5.0,
                ReviewCount = 210,
                ImageUrl = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Nutty Brown Butter • Dark Chocolate • Toffee Crunch",
                Ingredients = "Browned French Butter, Brown Sugar, Chopped Dark Chocolate, Pasture Eggs, Vanilla, Flour, Sea Salt",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Sicilian Pistachio & White Chocolate Cookie",
                Slug = "sicilian-pistachio-white-chocolate-cookie",
                Tagline = "Roasted Bronte pistachios with creamy vanilla bean white chocolate",
                Description = "Stuffed with 100% pure roasted Sicilian pistachio paste, studded with creamy white chocolate callets, and crowned with chopped emerald pistachios.",
                Price = 4.20m,
                StockQuantity = 15,
                DiscountPercent = 0,
                CategoryId = cookiesCat.Id,
                WeightOrServings = "1 Jumbo Cookie (100g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = true,
                Rating = 4.9,
                ReviewCount = 138,
                ImageUrl = "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Roasted Pistachio • Vanilla Cream • Buttery Dough",
                Ingredients = "Bronte Pistachio Paste, White Chocolate, Pure Butter, Sugar, Eggs, Flour, Vanilla",
                Allergens = "Tree Nuts, Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Double Dark Cocoa & Sea Salt Truffle Cookie",
                Slug = "double-dark-cocoa-sea-salt-cookie",
                Tagline = "Dark black cocoa dough with an oozing molten chocolate core",
                Description = "A dream for dark chocolate lovers: fudgy center that melts upon gentle warming, infused with black cocoa and sea salt.",
                Price = 3.90m,
                StockQuantity = 22,
                DiscountPercent = 0,
                CategoryId = cookiesCat.Id,
                WeightOrServings = "1 Jumbo Cookie (95g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = false,
                Rating = 4.8,
                ReviewCount = 89,
                ImageUrl = "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Deep Espresso Cocoa • Molten Core • Mineral Sea Salt",
                Ingredients = "Dutch Process Cocoa, 70% Chocolate Truffle Core, Butter, Sugar, Flour, Eggs",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Biscoff Speculoos Stuffed Cookie",
                Slug = "biscoff-speculoos-stuffed-cookie",
                Tagline = "Spiced cinnamon cookie dough with warm molten Biscoff heart",
                Description = "A comforting spiced cookie filled with creamy melted caramelized cookie butter and crushed speculoos biscuit crumble.",
                Price = 4.50m,
                StockQuantity = 16,
                DiscountPercent = 0,
                CategoryId = cookiesCat.Id,
                WeightOrServings = "1 Jumbo Cookie (105g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = false,
                Rating = 4.9,
                ReviewCount = 112,
                ImageUrl = "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Caramelized Cinnamon • Spiced Ginger • Brown Sugar",
                Ingredients = "Lotus Biscoff Spread, Butter, Brown Sugar, Cinnamon, Flour, Eggs, Vanilla",
                Allergens = "Dairy, Gluten, Eggs, Soy"
            },

            // Cakes
            new Product
            {
                Name = "Rose & Raspberry Vanilla Chiffon Cake",
                Slug = "rose-raspberry-vanilla-chiffon-cake",
                Tagline = "Featherlight vanilla sponge with rosewater cream and fresh raspberries",
                Description = "Ultra-light airy chiffon layers soaked in delicate organic rosewater syrup, filled with whipped Madagascar vanilla bean cream and tangy crushed raspberries.",
                Price = 40.80m,
                OriginalPrice = 48.00m,
                DiscountPercent = 15,
                StockQuantity = 6,
                CategoryId = cakesCat.Id,
                WeightOrServings = "0.5 KG (Serves 4 - 6)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = true,
                Rating = 5.0,
                ReviewCount = 152,
                ImageUrl = "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Wild Rose • Fresh Raspberry • Madagascar Vanilla",
                Ingredients = "Cake Flour, Free-range Eggs, Fresh Cream, Organic Raspberries, Rosewater, Cane Sugar, Butter",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Belgian 70% Dark Truffle Layer Cake",
                Slug = "belgian-dark-truffle-cake",
                Tagline = "Six decadent layers of moist devil's food and whipped chocolate ganache",
                Description = "A showstopping celebration cake. Moist cocoa sponge layered with whipped dark chocolate ganache, finished with cocoa nibs and edible 24k gold leaf.",
                Price = 54.00m,
                StockQuantity = 5,
                DiscountPercent = 0,
                CategoryId = cakesCat.Id,
                WeightOrServings = "0.5 KG (Serves 4 - 6)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = true,
                Rating = 4.9,
                ReviewCount = 98,
                ImageUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Bittersweet Ganache • Dutch Cocoa • Silky Dark Cream",
                Ingredients = "Belgian 70% Cocoa, Cream, Butter, Brown Sugar, Espresso, Flour, Eggs, Gold Leaf",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Earl Grey Lavender Honey Cake",
                Slug = "earl-grey-lavender-honey-cake",
                Tagline = "Bergamot infused tea sponge with lavender honey mascarpone frosting",
                Description = "Subtle, aromatic, and sophisticated. Steeped with loose-leaf bergamot black tea, balanced with wild lavender blossom honey and whipped mascarpone frosting.",
                Price = 50.00m,
                StockQuantity = 8,
                DiscountPercent = 0,
                CategoryId = cakesCat.Id,
                WeightOrServings = "0.5 KG (Serves 4 - 6)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = false,
                Rating = 4.8,
                ReviewCount = 67,
                ImageUrl = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Bergamot Tea • French Lavender • Blossom Honey",
                Ingredients = "Earl Grey Tea, Italian Mascarpone, French Butter, Honey, Flour, Eggs, Sugar",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Spiced Carrot & Walnut Layer Cake",
                Slug = "spiced-carrot-walnut-cake",
                Tagline = "Fresh grated carrots, toasted walnuts, and tangy whipped cream cheese",
                Description = "Tender, spiced cake packed with fresh organic carrots, toasted chopped walnuts, cinnamon, nutmeg, and crowned with velvety whipped Philadelphia cream cheese.",
                Price = 46.00m,
                StockQuantity = 7,
                DiscountPercent = 0,
                CategoryId = cakesCat.Id,
                WeightOrServings = "0.5 KG (Serves 4 - 6)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = false,
                Rating = 4.9,
                ReviewCount = 84,
                ImageUrl = "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Warm Cinnamon • Toasted Walnuts • Tangy Cream Cheese",
                Ingredients = "Organic Carrots, California Walnuts, Cream Cheese, Cinnamon, Nutmeg, Brown Sugar, Flour, Butter",
                Allergens = "Tree Nuts, Dairy, Gluten, Eggs"
            },

            // Pastries
            new Product
            {
                Name = "Flaky Almond Frangipane Croissant",
                Slug = "flaky-almond-frangipane-croissant",
                Tagline = "Twice-baked croissant soaked in vanilla syrup with toasted sliced almonds",
                Description = "Laminated over 3 days with French Isigny butter, filled with fragrant almond cream (frangipane), twice-baked until crisp and dusted with snow sugar.",
                Price = 4.80m,
                StockQuantity = 15,
                DiscountPercent = 0,
                CategoryId = pastriesCat.Id,
                WeightOrServings = "1 Pastry (130g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = true,
                Rating = 4.9,
                ReviewCount = 144,
                ImageUrl = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Nutty Almond Frangipane • Golden Butter Flakes • Vanilla",
                Ingredients = "French Butter (84% fat), Almond Meal, Wheat Flour, Sugar, Eggs, Sliced Almonds, Vanilla",
                Allergens = "Tree Nuts, Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Tahitian Vanilla Mille-Feuille",
                Slug = "tahitian-vanilla-mille-feuille",
                Tagline = "Three layers of caramelized puff pastry with silky vanilla diplomate cream",
                Description = "Crispy, caramelized wafer-thin puff pastry sheets layered with intensely aromatic Tahitian vanilla bean cream and delicate powdered sugar.",
                Price = 6.50m,
                StockQuantity = 10,
                DiscountPercent = 0,
                CategoryId = pastriesCat.Id,
                WeightOrServings = "1 Pastry (110g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = true,
                Rating = 5.0,
                ReviewCount = 92,
                ImageUrl = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Tahitian Vanilla Bean • Caramelized Pastry • Silky Diplomate",
                Ingredients = "Caramelized Inverted Puff Pastry, Tahitian Vanilla, Milk, Egg Yolks, Sugar, Butter, Gelatin",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Dark Berry Choux au Craquelin",
                Slug = "dark-berry-choux-au-craquelin",
                Tagline = "Crunchy craquelin choux filled with blackberry coulis & vanilla cream",
                Description = "Crisp choux pastry shell topped with a crunchy cookie craquelin disk, filled with light whipped chantilly and tart wild blackberry compote.",
                Price = 5.50m,
                StockQuantity = 12,
                DiscountPercent = 0,
                CategoryId = pastriesCat.Id,
                WeightOrServings = "1 Pastry (95g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = false,
                Rating = 4.8,
                ReviewCount = 59,
                ImageUrl = "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Crunchy Craquelin • Tart Wild Berry • Chantilly Cream",
                Ingredients = "Choux Pastry, Brown Sugar, Butter, Fresh Blackberries, Vanilla Chantilly, Milk, Eggs",
                Allergens = "Dairy, Gluten, Eggs"
            },
            new Product
            {
                Name = "Pistachio & Cardamom Escargot Danish",
                Slug = "pistachio-cardamom-escargot-danish",
                Tagline = "Swirled brioche puff with emerald pistachio creme and green cardamom",
                Description = "Viennoiserie perfection: buttery laminated spirals filled with stone-ground pistachio cream, infused with fragrant freshly cracked cardamom pods.",
                Price = 5.20m,
                StockQuantity = 0, // Demo Sold Out!
                IsSoldOut = true,
                DiscountPercent = 0,
                CategoryId = pastriesCat.Id,
                WeightOrServings = "1 Pastry (120g)",
                IsVeg = true,
                IsGlutenFree = false,
                IsFeatured = false,
                Rating = 4.9,
                ReviewCount = 76,
                ImageUrl = "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
                FlavourNotes = "Green Cardamom • Roasted Pistachio • Golden Flaky Dough",
                Ingredients = "Laminated Danish Dough, Butter, Pistachio Custard, Green Cardamom, Sugar, Milk, Eggs",
                Allergens = "Tree Nuts, Dairy, Gluten, Eggs"
            }
        };

        context.Products.AddRange(products);
        context.SaveChanges();
    }
}
