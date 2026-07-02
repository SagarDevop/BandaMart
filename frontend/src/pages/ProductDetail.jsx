import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { APP_CONFIG } from '../data/sampleData';
import { optimizeImageUrl } from '../utils/image';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProduct, products } = useProducts();
  const { addItem, getItemQuantity, increment, decrement } = useCart();
  const product = getProduct(productId);
  const qty = getItemQuantity(productId);
  const [localQty, setLocalQty] = useState(Math.max(1, qty));
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Flipkart style active image state
  const [activeImage, setActiveImage] = useState(product ? product.image : '');

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setLocalQty(Math.max(1, qty));
      setAdding(false);
      setAdded(false);
    }
  }, [product, productId, qty]);

  const allImages = product ? [
    product.image,
    product.image1,
    product.image2,
    product.image3
  ].filter(Boolean) : [];

  // Price calculations
  const hasOriginal = product ? (product.originalPrice && product.originalPrice > product.price) : false;
  const discountPercent = product ? (hasOriginal
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : ((product.price % 3 === 0) ? 15 : (product.price % 2 === 0) ? 10 : 20)) : 0;
  const originalPrice = product ? (hasOriginal
    ? product.originalPrice
    : Math.round(product.price / (1 - (discountPercent / 100)))) : 0;

  if (!product) {
    return (
      <div className="app-container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', flexDirection: 'column', gap: 'var(--space-md)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--outline-variant)' }}>
          error_outline
        </span>
        <p className="text-title-md" style={{ color: 'var(--on-surface-variant)' }}>
          Product not found
        </p>
        <button onClick={() => navigate('/')} style={{
          padding: 'var(--space-sm) var(--space-lg)',
          background: 'var(--primary)',
          color: 'var(--on-primary)',
          borderRadius: 'var(--radius-full)',
          fontWeight: 600,
        }}>
          Go Home
        </button>
      </div>
    );
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id && p.available)
    .slice(0, 5);

  const handleAddToCart = () => {
    if (qty > 0) return;
    setAdding(true);
    addItem(product);
    for (let i = 1; i < localQty; i++) {
      increment(product.id);
    }
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }, 400);
  };

  const totalPrice = product.price * localQty;

  return (
    <div className="app-container" style={{ paddingBottom: 100 }}>
      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 'var(--z-header)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-md) var(--container-padding)',
        background: 'rgba(248,250,247,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 40, height: 40,
            borderRadius: 'var(--radius-full)',
            background: 'var(--surface-container-lowest)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>arrow_back</span>
        </button>
        <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
          {APP_CONFIG.name}
        </h1>
        <div style={{
          width: 40, height: 40,
          borderRadius: 'var(--radius-full)',
          background: 'var(--surface-container-lowest)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>share</span>
        </div>
      </header>

      {/* Hero Image / Flipkart-style Gallery */}
      <section style={{
        background: '#ffffff',
        paddingTop: 80, // spacing for fixed header
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid var(--outline-variant)'
      }}>
        {/* Main cover image container */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.2',
          maxHeight: 340,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px'
        }}>
          <img
            src={optimizeImageUrl(activeImage, 600) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Horizontal Thumbnails (Flipkart style) */}
        {allImages.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px 16px',
            width: '100%',
            background: '#ffffff'
          }}>
            {allImages.map((imgUrl, index) => {
              const isSelected = activeImage === imgUrl;
              return (
                <div
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--outline-variant)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    padding: '3px',
                    boxShadow: isSelected ? '0 2px 8px rgba(132, 194, 37, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={optimizeImageUrl(imgUrl, 150)}
                    alt={`${product.name} view ${index + 1}`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Product Details Card */}
      <section style={{
        padding: '0 var(--container-padding)',
        marginTop: 16,
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 'var(--radius-3xl)',
          padding: 'var(--space-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--outline-variant)',
        }}>
          {/* Title + Price */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--space-md)',
          }}>
            <div>
              <h2 className="text-headline-xl" style={{ color: 'var(--primary)', margin: '0 0 var(--space-xs)' }}>
                {product.name}
              </h2>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: 'rgba(21,66,18,0.1)',
                color: 'var(--primary)',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                letterSpacing: '0.05em',
              }}>
                {product.available ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {originalPrice > product.price && (
                  <span style={{ textDecoration: 'line-through', fontSize: 13, color: 'var(--outline)', opacity: 0.8 }}>
                    ₹{originalPrice}
                  </span>
                )}
                <span className="text-headline-lg" style={{ color: '#2d8a4e', margin: 0, fontWeight: 800 }}>
                  ₹{product.price}
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--outline)' }}>
                per {product.unit}
              </span>
              {originalPrice > product.price && (
                <span style={{
                  fontSize: '10px',
                  background: '#ff3f6c',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  marginTop: 4,
                }}>
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={{
            borderTop: '1px solid var(--outline-variant)',
            paddingTop: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
            borderTopColor: 'rgba(194,201,187,0.3)',
          }}>
            <h3 className="text-title-md" style={{
              color: 'var(--primary)',
              margin: '0 0 var(--space-sm)',
            }}>
              Description
            </h3>
            <p className="text-body-lg" style={{
              color: 'var(--on-surface-variant)',
              margin: 0,
              lineHeight: 1.7,
            }}>
              {product.description}
            </p>
          </div>

          {/* Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
          }}>
            <div style={{
              background: 'var(--surface-container-low)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}>
              <span className="material-symbols-outlined filled" style={{ color: 'var(--primary)' }}>
                eco
              </span>
              <div>
                <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--outline)', margin: 0 }}>
                  Quality
                </p>
                <p className="text-title-md" style={{ fontSize: 13, color: 'var(--primary)', margin: 0 }}>
                  100% Fresh
                </p>
              </div>
            </div>
            <div style={{
              background: 'var(--surface-container-low)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}>
              <span className="material-symbols-outlined filled" style={{ color: 'var(--primary)' }}>
                timer
              </span>
              <div>
                <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--outline)', margin: 0 }}>
                  Delivery
                </p>
                <p className="text-title-md" style={{ fontSize: 13, color: 'var(--primary)', margin: 0 }}>
                  {APP_CONFIG.deliveryTime}
                </p>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-md) 0',
          }}>
            <p className="text-title-md" style={{ color: 'var(--primary)', margin: 0 }}>
              Select Quantity
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--surface-container-high)',
              borderRadius: 'var(--radius-full)',
              padding: '4px',
              boxShadow: 'var(--shadow-lg)',
            }}>
              <button
                onClick={() => {
                  if (qty > 0) {
                    decrement(product.id);
                  } else {
                    setLocalQty(q => Math.max(1, q - 1));
                  }
                }}
                style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  background: 'var(--surface-container-lowest)',
                  color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: (qty > 0 ? qty : localQty) <= 1 ? 0.4 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="text-headline-lg" style={{
                padding: '0 var(--space-lg)',
                color: 'var(--primary)',
                minWidth: 32,
                textAlign: 'center',
              }}>
                {qty > 0 ? qty : localQty}
              </span>
              <button
                onClick={() => {
                  if (qty > 0) {
                    increment(product.id);
                  } else {
                    setLocalQty(q => q + 1);
                  }
                }}
                style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'var(--on-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{
          marginTop: 'var(--space-xl)',
          padding: '0 var(--container-padding)',
          marginBottom: 'var(--space-xl)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <h3 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
              Pairs Well With
            </h3>
          </div>
          <div className="no-scrollbar" style={{
            display: 'flex',
            overflowX: 'auto',
            gap: 'var(--space-md)',
            marginLeft: 'calc(var(--container-padding) * -1)',
            marginRight: 'calc(var(--container-padding) * -1)',
            padding: '0 var(--container-padding) var(--space-md)',
          }}>
            {related.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                style={{
                  minWidth: 140,
                  background: 'var(--surface-container-lowest)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-sm)',
                  boxShadow: 'var(--shadow-lg)',
                  flexShrink: 0,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  marginBottom: 'var(--space-sm)',
                  background: 'var(--surface-container)',
                }}>
                  <img src={optimizeImageUrl(item.image, 200) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} alt={item.name} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p className="text-title-md" style={{ fontSize: 13, color: 'var(--primary)', margin: 0 }}>
                  {item.name}
                </p>
                <p className="text-label-sm" style={{ color: 'var(--secondary)', fontSize: 11, margin: '2px 0 0' }}>
                  ₹{item.price}/{item.unit}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sticky Add to Cart Footer */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        padding: 'var(--container-padding)',
        background: 'rgba(248,250,247,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 'var(--z-nav)',
      }}>
        {qty > 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            width: '100%',
          }}>
            {/* Stepper (Left) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '2px',
              height: 52,
              flex: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <button
                onClick={() => decrement(product.id)}
                style={{
                  width: 38, height: 38, borderRadius: 'var(--radius-lg)',
                  background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', fontWeight: 'bold', fontSize: 16
                }}
              >
                <span className="material-symbols-outlined" style={{ fontWeight: 'bold', fontSize: 18 }}>remove</span>
              </button>
              <span style={{
                fontWeight: 800, fontSize: 14, color: 'var(--primary)',
                minWidth: 24, textAlign: 'center'
              }}>
                {qty}
              </span>
              <button
                onClick={() => increment(product.id)}
                style={{
                  width: 38, height: 38, borderRadius: 'var(--radius-lg)',
                  background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontWeight: 'bold', fontSize: 16
                }}
              >
                <span className="material-symbols-outlined" style={{ fontWeight: 'bold', fontSize: 18 }}>add</span>
              </button>
            </div>

            {/* Go to Cart Button (Right) */}
            <button
              onClick={() => navigate('/cart')}
              style={{
                flex: 1.2,
                height: 52,
                background: '#164b2b', // Premium forest green
                color: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: 14.5,
                boxShadow: '0 4px 16px rgba(22, 75, 43, 0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
              Go to Cart
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={adding || !product.available}
            style={{
              width: '100%',
              background: added ? 'var(--secondary-container)' : 'var(--primary)',
              color: added ? 'var(--on-secondary-container)' : 'var(--on-primary)',
              padding: '16px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-md)',
              boxShadow: '0 4px 20px rgba(21,66,18,0.2)',
              transition: 'all 0.3s ease',
              opacity: product.available ? 1 : 0.5,
            }}
          >
            {adding ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                <span className="text-headline-lg-mobile" style={{ fontSize: 18 }}>Adding...</span>
              </>
            ) : added ? (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                <span className="text-headline-lg-mobile" style={{ fontSize: 18 }}>Added to Cart</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined filled">shopping_cart</span>
                <span className="text-headline-lg-mobile" style={{ fontSize: 18 }}>Add to Cart</span>
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--primary-container)',
                  color: 'var(--on-primary-container)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  ₹{totalPrice}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
