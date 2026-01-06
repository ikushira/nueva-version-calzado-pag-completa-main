// product-images.js
// Utilidades para normalizar rutas de imágenes de productos
(function(global) {
  const isInsideMyPageshoes = () => window.location.pathname.replace(/\\/g, '/').includes('/mypageshoes/');

  const resolveAssetPath = (relativePath) => {
    const cleanPath = (relativePath || '').replace(/^\.\//, '').replace(/^\//, '');
    if (isInsideMyPageshoes()) {
      return cleanPath.startsWith('mypageshoes/') ? cleanPath.replace(/^mypageshoes\//, '') : cleanPath;
    }
    return cleanPath.startsWith('mypageshoes/') ? cleanPath : `mypageshoes/${cleanPath}`;
  };

  const normalizeImageName = (imageEntry) => {
    if (!imageEntry || typeof imageEntry !== 'string') return 'placeholder.png';
    const parts = imageEntry.split('/');
    return parts[parts.length - 1] || 'placeholder.png';
  };

  const getProductImage = (product, index = 0) => {
    if (!product) return resolveAssetPath('images/placeholder.png');
    const images = Array.isArray(product.images) ? product.images : [];
    const chosen = images[index] || images[0];
    const fileName = normalizeImageName(chosen);
    const candidate = `images/products/${product.id}/${fileName}`;
    return resolveAssetPath(candidate);
  };

  const getPlaceholderImage = () => resolveAssetPath('images/placeholder.png');

  global.getProductImage = getProductImage;
  global.getPlaceholderImage = getPlaceholderImage;
  global.resolveAssetPath = resolveAssetPath;
})(window);
