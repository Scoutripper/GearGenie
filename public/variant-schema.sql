-- ============================================
-- PRODUCT VARIANT MANAGEMENT SYSTEM - SQL Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- Step 1: Create product_variants table
CREATE TABLE product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(50) NOT NULL,
    size VARCHAR(20) NOT NULL,
    variant_images TEXT[] DEFAULT '{}',
    rent_price DECIMAL(10, 2) DEFAULT 0,
    buy_price DECIMAL(10, 2) DEFAULT 0,
    original_price DECIMAL(10, 2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    availability_type VARCHAR(20) DEFAULT 'both',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for faster queries
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_color ON product_variants(color);

-- Add RLS policies
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to variants"
    ON product_variants FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated insert access to variants"
    ON product_variants FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to variants"
    ON product_variants FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete access to variants"
    ON product_variants FOR DELETE
    TO authenticated
    USING (true);

-- Step 2: Add variant columns to order_items
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id),
ADD COLUMN IF NOT EXISTS variant_sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS selected_color VARCHAR(50),
ADD COLUMN IF NOT EXISTS selected_size VARCHAR(20),
ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);
