/**
 * Converts width and height from pixels to centimeters.
 * Assumes a DPI of 96, where 1 cm ≈ 37.7953 pixels.
 *
 * @param {number} width - The width in pixels.
 * @param {number} height - The height in pixels.
 * @returns {string} - The width and height in centimeters formatted as "(width x height)".
 */
export function pxToCm(width, height) {
    const cmPerPx = 1 / 37.7953;
    const widthCm = (width * cmPerPx).toFixed(2);
    const heightCm = (height * cmPerPx).toFixed(2);
    return `(${widthCm} x ${heightCm})`;
  }