/**
 * @name normalizeToRange
 * @description Normalizes a value from 0 to 100 to a value from 0 to canvas.width
 * @param {number} value - The value to normalize
 * @param {number} min - The minimum value of the range
 * @param {number} max - The maximum value of the range
 * @returns {number} The normalized value
 */
 export default function normalize (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
 }