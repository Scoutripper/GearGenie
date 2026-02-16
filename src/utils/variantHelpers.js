/**
 * Variant Helper Utilities
 * Shared logic for SKU generation, variant grid creation, and variant lookup.
 */

/**
 * Generate a SKU string from product name, color, and size.
 * Example: "Hiking Shoes", "Red", "M" → "HIKING-SHOES-RED-M"
 */
export const generateSKU = (productName, color, size) => {
  const cleanName = productName
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .toUpperCase();
  const cleanColor = color
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .toUpperCase();
  const cleanSize = size.replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase();
  return `${cleanName}-${cleanColor}-${cleanSize}`;
};

/**
 * Generate a full variant grid from colors and sizes arrays.
 * Pre-populates each variant with the given default pricing/stock.
 *
 * @param {string} productName - The product name for SKU generation
 * @param {string[]} colors - Array of color strings
 * @param {string[]} sizes - Array of size strings
 * @param {object} defaults - Default values: { rent_price, buy_price, original_price, stock_quantity, availability_type }
 * @returns {object[]} Array of variant objects
 */
export const generateVariants = (productName, colors, sizes, defaults = {}) => {
  const variants = [];

  for (const color of colors) {
    for (const size of sizes) {
      variants.push({
        sku: generateSKU(productName, color, size),
        color,
        size,
        variant_images: [],
        rent_price: defaults.rent_price || 0,
        buy_price: defaults.buy_price || 0,
        original_price: defaults.original_price || 0,
        stock_quantity: defaults.stock_quantity ?? 10,
        in_stock: (defaults.stock_quantity ?? 10) > 0,
        availability_type: defaults.availability_type || "both",
      });
    }
  }

  return variants;
};

/**
 * Find a specific variant by color and size from a list of variants.
 *
 * @param {object[]} variants
 * @param {string} color
 * @param {string} size
 * @returns {object|null}
 */
export const findVariant = (variants, color, size) => {
  return variants.find((v) => v.color === color && v.size === size) || null;
};

/**
 * Get all unique colors from variants.
 */
export const getAvailableColors = (variants) => {
  return [...new Set(variants.map((v) => v.color))];
};

/**
 * Get available sizes for a given color, including stock info.
 *
 * @param {object[]} variants
 * @param {string} color
 * @returns {{ size: string, inStock: boolean, stock: number }[]}
 */
export const getAvailableSizesForColor = (variants, color) => {
  return variants
    .filter((v) => v.color === color)
    .map((v) => ({
      size: v.size,
      inStock: v.in_stock && v.stock_quantity > 0,
      stock: v.stock_quantity,
    }));
};
