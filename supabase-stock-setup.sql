-- =============================================
-- THAJVI STOCK SETUP — Run in Supabase SQL Editor
-- =============================================

-- Step 1: Clear old test data
DELETE FROM products_stock;

-- Step 2: Insert all 15 real products with current stock from products.json
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mud-brown-co-ord-set', 'MUD BROWN CO ORD SET', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mud-brown-co-ord-set', 'MUD BROWN CO ORD SET', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mud-brown-co-ord-set', 'MUD BROWN CO ORD SET', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mud-brown-co-ord-set', 'MUD BROWN CO ORD SET', 'XL', 2, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mud-brown-co-ord-set', 'MUD BROWN CO ORD SET', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mud-brown-co-ord-set', 'MUD BROWN CO ORD SET', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pink-blossom', 'PINK BLOSSOM', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pink-blossom', 'PINK BLOSSOM', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pink-blossom', 'PINK BLOSSOM', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pink-blossom', 'PINK BLOSSOM', 'XL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pink-blossom', 'PINK BLOSSOM', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pink-blossom', 'PINK BLOSSOM', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-shirt-model-maxi-dress', 'BLUE SHIRT MODEL MAXI DRESS', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-shirt-model-maxi-dress', 'BLUE SHIRT MODEL MAXI DRESS', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-shirt-model-maxi-dress', 'BLUE SHIRT MODEL MAXI DRESS', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-shirt-model-maxi-dress', 'BLUE SHIRT MODEL MAXI DRESS', 'XL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-shirt-model-maxi-dress', 'BLUE SHIRT MODEL MAXI DRESS', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-shirt-model-maxi-dress', 'BLUE SHIRT MODEL MAXI DRESS', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-cotton-maxi-dress', 'MUL COTTON MAXI DRESS', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-cotton-maxi-dress', 'MUL COTTON MAXI DRESS', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-cotton-maxi-dress', 'MUL COTTON MAXI DRESS', 'L', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-cotton-maxi-dress', 'MUL COTTON MAXI DRESS', 'XL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-cotton-maxi-dress', 'MUL COTTON MAXI DRESS', 'XXL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-cotton-maxi-dress', 'MUL COTTON MAXI DRESS', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('comfy-cotton-short-kurthi-co-ords', 'COMFY COTTON SHORT KURTHI CO ORDS', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('comfy-cotton-short-kurthi-co-ords', 'COMFY COTTON SHORT KURTHI CO ORDS', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('comfy-cotton-short-kurthi-co-ords', 'COMFY COTTON SHORT KURTHI CO ORDS', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('comfy-cotton-short-kurthi-co-ords', 'COMFY COTTON SHORT KURTHI CO ORDS', 'XL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('comfy-cotton-short-kurthi-co-ords', 'COMFY COTTON SHORT KURTHI CO ORDS', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('comfy-cotton-short-kurthi-co-ords', 'COMFY COTTON SHORT KURTHI CO ORDS', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-tulip', 'BLUE TULIP', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-tulip', 'BLUE TULIP', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-tulip', 'BLUE TULIP', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-tulip', 'BLUE TULIP', 'XL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-tulip', 'BLUE TULIP', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-tulip', 'BLUE TULIP', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('rayon-co-ords', 'RAYON CO ORDS', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('rayon-co-ords', 'RAYON CO ORDS', 'M', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('rayon-co-ords', 'RAYON CO ORDS', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('rayon-co-ords', 'RAYON CO ORDS', 'XL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('rayon-co-ords', 'RAYON CO ORDS', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('rayon-co-ords', 'RAYON CO ORDS', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('cotton-feeding-friendly-top-top', 'COTTON FEEDING FRIENDLY TOP TOP', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('cotton-feeding-friendly-top-top', 'COTTON FEEDING FRIENDLY TOP TOP', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('cotton-feeding-friendly-top-top', 'COTTON FEEDING FRIENDLY TOP TOP', 'L', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('cotton-feeding-friendly-top-top', 'COTTON FEEDING FRIENDLY TOP TOP', 'XL', 2, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('cotton-feeding-friendly-top-top', 'COTTON FEEDING FRIENDLY TOP TOP', 'XXL', 2, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('cotton-feeding-friendly-top-top', 'COTTON FEEDING FRIENDLY TOP TOP', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mehandi-green-co-ord-set', 'MEHANDI GREEN CO ORD SET', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mehandi-green-co-ord-set', 'MEHANDI GREEN CO ORD SET', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mehandi-green-co-ord-set', 'MEHANDI GREEN CO ORD SET', 'L', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mehandi-green-co-ord-set', 'MEHANDI GREEN CO ORD SET', 'XL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mehandi-green-co-ord-set', 'MEHANDI GREEN CO ORD SET', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mehandi-green-co-ord-set', 'MEHANDI GREEN CO ORD SET', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-cod-ord-set', 'BLUE COD ORD SET', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-cod-ord-set', 'BLUE COD ORD SET', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-cod-ord-set', 'BLUE COD ORD SET', 'L', 2, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-cod-ord-set', 'BLUE COD ORD SET', 'XL', 2, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-cod-ord-set', 'BLUE COD ORD SET', 'XXL', 3, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('blue-cod-ord-set', 'BLUE COD ORD SET', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('party-wear-salwar-set', 'PARTY WEAR SALWAR SET', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('party-wear-salwar-set', 'PARTY WEAR SALWAR SET', 'M', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('party-wear-salwar-set', 'PARTY WEAR SALWAR SET', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('party-wear-salwar-set', 'PARTY WEAR SALWAR SET', 'XL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('party-wear-salwar-set', 'PARTY WEAR SALWAR SET', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('party-wear-salwar-set', 'PARTY WEAR SALWAR SET', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pure-mul-chanderi-3-piece-set', 'PURE MUL CHANDERI 3 PIECE SET', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pure-mul-chanderi-3-piece-set', 'PURE MUL CHANDERI 3 PIECE SET', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pure-mul-chanderi-3-piece-set', 'PURE MUL CHANDERI 3 PIECE SET', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pure-mul-chanderi-3-piece-set', 'PURE MUL CHANDERI 3 PIECE SET', 'XL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pure-mul-chanderi-3-piece-set', 'PURE MUL CHANDERI 3 PIECE SET', 'XXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('pure-mul-chanderi-3-piece-set', 'PURE MUL CHANDERI 3 PIECE SET', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-chnaderi-3-piece-set', 'MUL CHNADERI 3 PIECE SET', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-chnaderi-3-piece-set', 'MUL CHNADERI 3 PIECE SET', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-chnaderi-3-piece-set', 'MUL CHNADERI 3 PIECE SET', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-chnaderi-3-piece-set', 'MUL CHNADERI 3 PIECE SET', 'XL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-chnaderi-3-piece-set', 'MUL CHNADERI 3 PIECE SET', 'XXL', 2, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('mul-chnaderi-3-piece-set', 'MUL CHNADERI 3 PIECE SET', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('yellow-german-rayon-cotton-3-piece-set', 'YELLOW GERMAN RAYON COTTON 3 PIECE SET', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('yellow-german-rayon-cotton-3-piece-set', 'YELLOW GERMAN RAYON COTTON 3 PIECE SET', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('yellow-german-rayon-cotton-3-piece-set', 'YELLOW GERMAN RAYON COTTON 3 PIECE SET', 'L', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('yellow-german-rayon-cotton-3-piece-set', 'YELLOW GERMAN RAYON COTTON 3 PIECE SET', 'XL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('yellow-german-rayon-cotton-3-piece-set', 'YELLOW GERMAN RAYON COTTON 3 PIECE SET', 'XXL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('yellow-german-rayon-cotton-3-piece-set', 'YELLOW GERMAN RAYON COTTON 3 PIECE SET', 'XXXL', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('golden-glitter', 'GOLDEN GLITTER', 'S', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('golden-glitter', 'GOLDEN GLITTER', 'M', 0, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('golden-glitter', 'GOLDEN GLITTER', 'L', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('golden-glitter', 'GOLDEN GLITTER', 'XL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('golden-glitter', 'GOLDEN GLITTER', 'XXL', 1, 0, 0, 5);
INSERT INTO products_stock (sku, product_name, size, stock_qty, reserved_qty, sold_qty, low_stock_threshold) VALUES ('golden-glitter', 'GOLDEN GLITTER', 'XXXL', 0, 0, 0, 5);

-- Step 3: Create reduce_stock RPC function (atomic stock decrement after payment)
CREATE OR REPLACE FUNCTION reduce_stock(p_sku TEXT, p_size TEXT, p_quantity INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE products_stock
  SET stock_qty = stock_qty - p_quantity,
      sold_qty = sold_qty + p_quantity,
      updated_at = NOW()
  WHERE sku = p_sku AND size = p_size AND stock_qty >= p_quantity;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create stock_warnings table (logs errors during stock reduction)
CREATE TABLE IF NOT EXISTS stock_warnings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  warning_type TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
