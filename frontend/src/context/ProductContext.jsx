import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/sampleData';

const ProductContext = createContext();

export const API_BASE = import.meta.env.VITE_API_URL || 'https://bandamart.onrender.com/api';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initCatalog() {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`)
        ]);
        if (resProd.ok && resCat.ok) {
          let prods = await resProd.json();
          let cats = await resCat.json();

          if (cats.length === 0) {
            cats = CATEGORIES;
          }
          if (prods.length === 0) {
            prods = PRODUCTS;
          }

          setProducts(prods);
          setCategories(cats);
        } else {
          throw new Error('API returned invalid status');
        }
      } catch (err) {
        console.error('Failed to fetch catalog from backend, loading fallback sample data:', err);
        setCategories(CATEGORIES);
        setProducts(PRODUCTS);
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
        setProducts(prev => [newProd, ...prev]);
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
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
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
        setProducts(prev => prev.filter(p => p.id !== id));
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
        setCategories(prev => [...prev, newCat]);
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
        setCategories(prev => prev.map(c => c.id === id ? updated : c));
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
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const getCategory = (id) => categories.find(c => c.id === id);

  const getCategoryProductCount = (categoryId) =>
    products.filter(p => p.category === categoryId).length;

  if (loading) {
    return <CatalogSplash />;
  }

  return (
    <ProductContext.Provider value={{
      products, categories, loading,
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
