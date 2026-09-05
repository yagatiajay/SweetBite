# 🧁 Sweet Bite – Artisan Bakery & Patisserie

A full-stack, minimal artisan bakery web application inspired by [CakeLab](https://cakelab.framer.website/). Built for **Sweet Bite**, specializing in handcrafted brownies, cookies, celebration cakes, and flaky pastries.

---

## 🌟 Features

- **Warm Minimalist Aesthetic**: Inspired by CakeLab's soft blush-cream backdrop (`#fff6f5`), deep cocoa typography (`#3d2314`), warm caramel gold accents (`#b67c26`), and editorial typography (*Fraunces*, *DM Sans*, *Dancing Script*).
- **Interactive Treats Catalog**: Category filtering (All Treats, Brownies, Cookies, Cakes, Pastries), dietary toggle (🌱 100% Eggless), and live instant search.
- **Custom Treat Box Builder**: Interactive 4-piece and 6-piece assorted gift box configurator with real-time slot selection.
- **Quick View Modal**: Inspect detailed ingredients, flavor notes, and allergen warnings for each treat.
- **Slide-out Cart & Checkout Drawer**: Quantity management, free delivery progress bar (free on $40+), fulfillment method toggle (Delivery / Bakery Pickup), and order reservation form with celebration confetti!
- **Custom Cake & Event Inquiries**: Bespoke celebration inquiry form for weddings, birthdays, and party dessert tables.
- **Full-Stack Integration**:
  - **Frontend**: React 18 + Vite with custom Vanilla CSS tokens and Lucide icons.
  - **Backend**: ASP.NET Core 8 Web API with Swagger/OpenAPI documentation.
  - **Database**: Entity Framework Core 8 with SQLite (`sweetbite.db`).

---

## 🚀 Quick Start

### 1. Start the .NET Backend

```bash
cd /Users/ajay/VsCode/SweetBite/backend
dotnet run --launch-profile http
```
- **API Base URL**: `http://localhost:5018/api`
- **Swagger Documentation**: `http://localhost:5018/swagger`

### 2. Start the React Frontend

```bash
cd /Users/ajay/VsCode/SweetBite/frontend
npm run dev
```
- **Web App**: `http://localhost:5173`

---

## 📂 Project Architecture

```
/Users/ajay/VsCode/SweetBite/
├── backend/
│   ├── Controllers/          # Products, Categories, Orders, Inquiries
│   ├── Data/                 # SweetBiteDbContext & SeedData
│   ├── Models/               # Product, Category, Order, OrderItem, Inquiry
│   ├── DTOs/                 # CreateOrderDto, CreateInquiryDto
│   ├── Program.cs            # EF Core SQLite, CORS, Swagger setup
│   └── SweetBite.API.csproj
└── frontend/
    ├── public/
    │   ├── hero-bakery.jpg   # High-resolution hero showcase image
    │   └── treat-box.jpg     # Artisanal treat box packaging image
    ├── src/
    │   ├── components/       # Navbar, Hero, TreatsCatalog, ProductCard, ProductModal,
    │   │                     # BoxBuilder, StorySection, Testimonials, CustomOrderForm,
    │   │                     # FAQSection, Footer, CartDrawer
    │   ├── context/          # CartContext (cart items, quantities, confetti feedback)
    │   ├── services/         # api.js (.NET Web API client)
    │   ├── styles/           # tokens.css & global.css (Vanilla CSS tokens)
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

---

## 🎂 Product Categories

1. **Brownies**: *Signature Fudgy Sea Salt Brownie*, *Salted Caramel Pretzel Brookie*, *Midnight Espresso Hazelnut Brownie*, *Ruby Raspberry Ganache Brownie*
2. **Cookies**: *Brown Butter Chocolate Chunk*, *Sicilian Pistachio & White Chocolate*, *Double Dark Cocoa & Sea Salt*, *Biscoff Speculoos Stuffed Cookie*
3. **Cakes**: *Rose & Raspberry Vanilla Chiffon Cake*, *Belgian 70% Dark Truffle Layer Cake*, *Earl Grey Lavender Honey Cake*, *Spiced Carrot & Walnut Cake*
4. **Pastries**: *Flaky Almond Frangipane Croissant*, *Tahitian Vanilla Mille-Feuille*, *Dark Berry Choux au Craquelin*, *Pistachio Cardamom Escargot Danish*
5. **Assorted Gift Boxes**: *Curated 4-Piece & 6-Piece Treat Boxes*
