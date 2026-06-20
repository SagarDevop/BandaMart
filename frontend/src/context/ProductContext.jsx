import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const API_BASE = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api'
);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial catalog data
  useEffect(() => {
    async function initCatalog() {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`)
        ]);
        if (resProd.ok && resCat.ok) {
          const prods = await resProd.json();
          const cats = await resCat.json();
          setProducts(prods);
          setCategories(cats);
        }
      } catch (err) {
        console.error('Failed to fetch catalog from backend:', err);
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

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
