import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://bandamart.onrender.com/api');

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('918957471581');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initCatalog() {
      // 1. Try to load from localStorage cache first
      let cachedProds = null;
      let cachedCats = null;
      let cachedWhatsapp = '918957471581';
      try {
        const p = localStorage.getItem('bandamart_cache_products');
        const c = localStorage.getItem('bandamart_cache_categories');
        const w = localStorage.getItem('bandamart_cache_whatsapp');
        if (p && c) {
          cachedProds = JSON.parse(p);
          cachedCats = JSON.parse(c);
        }
        if (w) {
          cachedWhatsapp = w;
        }
      } catch (e) {
        console.warn('Failed to read localStorage cache:', e);
      }

      // If we have cached data, render it immediately and hide the loader
      if (cachedProds && cachedCats && cachedProds.length > 0 && cachedCats.length > 0) {
        setProducts(cachedProds);
        setCategories(cachedCats);
        setWhatsappNumber(cachedWhatsapp);
        setLoading(false);
      }

      // 2. Revalidate in the background
      try {
        const [resProd, resCat, resSettings] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/settings`).catch(err => {
            console.warn('Failed to fetch settings from backend:', err);
            return { ok: false };
          })
        ]);
        if (resProd.ok && resCat.ok) {
          let prods = await resProd.json();
          let cats = await resCat.json();
          let whatsapp = '918957471581';
          if (resSettings && resSettings.ok) {
            const settings = await resSettings.json();
            if (settings.whatsapp_number) {
              whatsapp = settings.whatsapp_number;
            }
          }

          // Compare with cached data to avoid state updates and re-renders if nothing changed
          const prodsStr = JSON.stringify(prods);
          const catsStr = JSON.stringify(cats);
          const cachedProdsStr = cachedProds ? JSON.stringify(cachedProds) : '';
          const cachedCatsStr = cachedCats ? JSON.stringify(cachedCats) : '';

          if (prodsStr !== cachedProdsStr || catsStr !== cachedCatsStr || whatsapp !== cachedWhatsapp) {
            setProducts(prods);
            setCategories(cats);
            setWhatsappNumber(whatsapp);
            
            // Save to cache
            localStorage.setItem('bandamart_cache_products', prodsStr);
            localStorage.setItem('bandamart_cache_categories', catsStr);
            localStorage.setItem('bandamart_cache_whatsapp', whatsapp);
          }
        } else {
          throw new Error('API returned invalid status');
        }
      } catch (err) {
        console.error('Failed to fetch catalog from backend:', err);
        // Only load blank arrays if we don't have any cached data at all
        if (!cachedProds || !cachedCats) {
          setCategories([]);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    }
    initCatalog();
  }, []);

  const addProduct = async (product) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const newProd = await res.json();
        setProducts(prev => {
          const updated = [newProd, ...prev];
          localStorage.setItem('bandamart_cache_products', JSON.stringify(updated));
          return updated;
        });
        return newProd;
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => {
          const newProds = prev.map(p => p.id === id ? updated : p);
          localStorage.setItem('bandamart_cache_products', JSON.stringify(newProds));
          return newProds;
        });
        return updated;
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(prev => {
          const newProds = prev.filter(p => p.id !== id);
          localStorage.setItem('bandamart_cache_products', JSON.stringify(newProds));
          return newProds;
        });
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const getProduct = (id) => products.find(p => p.id === id);

  const getProductsByCategory = (categoryId) =>
    products.filter(p => p.category === categoryId && p.available);

  const getFeaturedProducts = () => products.filter(p => p.featured && p.available);

  const searchProducts = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return products.filter(p =>
      p.available && (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    );
  };

  const addCategory = async (category) => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories(prev => {
          const updated = [...prev, newCat];
          localStorage.setItem('bandamart_cache_categories', JSON.stringify(updated));
          return updated;
        });
        return newCat;
      }
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories(prev => {
          const newCats = prev.map(c => c.id === id ? updated : c);
          localStorage.setItem('bandamart_cache_categories', JSON.stringify(newCats));
          return newCats;
        });
        return updated;
      }
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories(prev => {
          const newCats = prev.filter(c => c.id !== id);
          localStorage.setItem('bandamart_cache_categories', JSON.stringify(newCats));
          return newCats;
        });
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const getCategory = (id) => categories.find(c => c.id === id);

  const getCategoryProductCount = (categoryId) =>
    products.filter(p => p.category === categoryId).length;

  const updateWhatsappNumber = async (number) => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'whatsapp_number', value: number }),
      });
      if (res.ok) {
        const updated = await res.json();
        const cleanVal = updated.value;
        setWhatsappNumber(cleanVal);
        localStorage.setItem('bandamart_cache_whatsapp', cleanVal);
        return cleanVal;
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update WhatsApp number');
      }
    } catch (err) {
      console.error('Error updating WhatsApp number:', err);
      throw err;
    }
  };

  if (loading) {
    return <CatalogSplash />;
  }

  return (
    <ProductContext.Provider value={{
      products, categories, loading, whatsappNumber, updateWhatsappNumber,
      addProduct, updateProduct, deleteProduct, getProduct,
      getProductsByCategory, getFeaturedProducts, searchProducts,
      addCategory, updateCategory, deleteCategory, getCategory,
      getCategoryProductCount
    }}>
      {children}
    </ProductContext.Provider>
  );
}

function CatalogSplash() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      width: '100%',
      maxWidth: 480,
      margin: '0 auto',
      background: 'var(--background)',
      color: 'var(--primary)',
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-md)',
        textAlign: 'center',
        padding: 'var(--space-xl)',
      }}>
        {/* Brand Icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-xl)',
          background: 'var(--primary)',
          color: 'var(--on-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-xs)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 44 }}>
            storefront
          </span>
        </div>

        <h1 className="text-headline-xl" style={{ margin: 0, fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em' }}>
          BandaMart
        </h1>
        <p className="text-body-md" style={{ color: 'var(--outline)', margin: 0, fontSize: 14 }}>
          Sab Kuch, Ek Jagah
        </p>

        {/* Premium rotating loader */}
        <span className="material-symbols-outlined animate-spin" style={{
          color: 'var(--primary)',
          fontSize: 28,
          marginTop: 'var(--space-xl)',
          display: 'inline-block',
        }}>
          progress_activity
        </span>

        <p className="text-label-sm" style={{
          color: 'var(--outline)',
          marginTop: 'var(--space-2xl)',
          fontSize: 10,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Connecting Banda's Farms to Your Home
        </p>
      </div>
    </div>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
