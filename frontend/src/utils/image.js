/**
 * Optimizes image URLs on-the-fly for Unsplash and Cloudinary.
 * Reduces bandwidth and improves loading performance significantly.
 * 
 * @param {string} url - Original image URL
 * @param {number} width - Target width in pixels
 * @returns {string} Optimized image URL
 */
export function optimizeImageUrl(url, width = 400) {
  if (!url) return '';

  // 1. Optimize Cloudinary URLs
  if (url.includes('res.cloudinary.com')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const insertionPoint = uploadIndex + '/upload/'.length;
      return url.slice(0, insertionPoint) + `f_auto,q_auto,w_${width},c_limit/` + url.slice(insertionPoint);
    }
  }

  // 2. Optimize Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', '70');
      urlObj.searchParams.set('auto', 'format');
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  return url;
}
