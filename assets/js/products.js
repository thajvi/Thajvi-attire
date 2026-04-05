// ============================================================
//   THAJVI ATTIRE™ — Product List
//
//   HOW TO ADD A NEW PRODUCT:
//   Copy one block below (from { to },) and paste it.
//   Fill in your details and save the file.
//
//   HOW TO DELETE A PRODUCT:
//   Delete the entire block from { to },
//
//   HOW TO ADD A PHOTO:
//   1. Put the photo in the  assets/images/products/  folder
//   2. Type the filename in the "photo" line
//      Example:  photo: "assets/images/products/green-kurti.jpg"
//
//   SIZES: Type the available sizes separated by commas
//      Example:  sizes: "M, L, XL, XXL"
//
//   BADGE OPTIONS (leave empty "" for no badge):
//      badge: "Bestseller"
//      badge: "New Arrival"
//      badge: ""
//
//   FABRIC: The primary fabric of the product
//      fabric: "Pure Cotton"
//      fabric: "Mul Chanderia"
//
//   OCCASION: When/where to wear it
//      occasion: "Daily Wear"
//      occasion: "Festive"
//      occasion: "Office Wear"
//
//   STOCK: Urgency cue (leave empty "" for none)
//      stock: "Selling Fast"
//      stock: "Only 3 Left"
//      stock: "Limited Stock"
// ============================================================

const products = [

  {
    name:        "Cotton Kurtha",
    description: "Breathable premium cotton — comfortable for all-day wear. Available in multiple colours.",
    price:       "₹XXX",
    sizes:       "M, L, XL, XXL",
    photo:       "",              // e.g. "assets/images/products/cotton-kurtha.jpg"
    badge:       "Bestseller",
    fabric:      "Pure Cotton",
    occasion:    "Daily Wear",
    stock:       "Selling Fast",
    whatsapp:    "918129651993"  // replace with your WhatsApp number
  },

  {
    name:        "Mul Chanderia Line Top",
    description: "Light & flowy Mul Chanderia fabric with elegant line embroidery. Perfect for festivals.",
    price:       "₹XXX",
    sizes:       "M, L, XL, XXL",
    photo:       "",
    badge:       "New Arrival",
    fabric:      "Mul Chanderia",
    occasion:    "Festive",
    stock:       "",
    whatsapp:    "918129651993"
  },

  {
    name:        "Printed Floral Kurta Set",
    description: "Beautiful floral print kurta with matching pants — ready to wear, effortlessly stylish.",
    price:       "₹XXX",
    sizes:       "M, L, XL, XXL",
    photo:       "",
    badge:       "",
    fabric:      "Cotton Blend",
    occasion:    "Office Wear",
    stock:       "Only 5 Left",
    whatsapp:    "918129651993"
  },

  {
    name:        "Embroidered A-Line Kurti",
    description: "Handcrafted floral embroidery on a flattering A-line silhouette. Great for occasions.",
    price:       "₹XXX",
    sizes:       "M, L, XL, XXL",
    photo:       "",
    badge:       "Bestseller",
    fabric:      "Cotton",
    occasion:    "Outings",
    stock:       "Limited Stock",
    whatsapp:    "918129651993"
  },

  {
    name:        "Straight Cut Printed Kurti",
    description: "Classic straight cut in vibrant prints — pair with pants or jeans for a chic look.",
    price:       "₹XXX",
    sizes:       "M, L, XL, XXL",
    photo:       "",
    badge:       "New Arrival",
    fabric:      "Rayon",
    occasion:    "Daily Wear",
    stock:       "",
    whatsapp:    "918129651993"
  },

  {
    name:        "Festive Embroidered Set",
    description: "Heavy embroidery with rich fabric — curated for weddings, parties & special occasions.",
    price:       "₹XXX",
    sizes:       "M, L, XL, XXL",
    photo:       "",
    badge:       "",
    fabric:      "Chanderi Silk",
    occasion:    "Festive",
    stock:       "Selling Fast",
    whatsapp:    "918129651993"
  }

];
