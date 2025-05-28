import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductReviews from "../components/ProductReviews";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { fetchProductById } from "../api/productApi";
import { toast, ToastContainer } from "react-toastify";
import { useCart } from "../context/CartContext";
import { addToCart } from "../api/cart";
import { addToWishlist } from "../api/wishlistApi";
import { useAuth } from "../context/AuthContext";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageKey, setSelectedImageKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [colorImages, setColorImages] = useState([]);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [allThumbnails, setAllThumbnails] = useState([]);
  const { isAuthenticated } = useAuth();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} styles={{ color: "#facc15" }} />);
    }

    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" styles={{ color: "#facc15" }} />);
    }

    const remaining = totalStars - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} styles={{ color: "#facc15" }} />);
    }

    return stars;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(id);
        setProduct(res);

        if (res.Images && res.Images.length > 0) {
          setSelectedImage(res.Images[0].image_url);
        }

        if (res.ProductColors?.length) {
          setSelectedColor(res.ProductColors[0]);
        }

        // Combine all images from product.Images and all ProductColors' images
        let combinedImages = [];
        if (res.Images) {
          combinedImages = [...res.Images];
        }
        if (res.ProductColors) {
          res.ProductColors.forEach((color) => {
            if (color.Images) {
              combinedImages = combinedImages.concat(color.Images);
            }
          });
        }
        setAllThumbnails(combinedImages);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (color.Images && color.Images.length > 0) {
      // On color select, only update main image to first image of selected color
      setSelectedImage(color.Images[0].image_url);
    }
  };

  const handleAddToCart = async (colorId) => {
    // console.log("handleAddToCart called with selectedImage:", selectedImage);
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    let matchedColorId = null;
    if (product?.ProductColors) {
      for (const color of product.ProductColors) {
        if (color.Images) {
          const match = color.Images.find(
            (img) => img.image_url === selectedImage
          );
          if (match) {
            matchedColorId = color.id;
            break;
          }
        }
      }
    }

    try {
      setAdding(true);
      await addToCart(product.id, 1, null, matchedColorId);
      await refreshCart();
      toast.success("Product added");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    } finally {
      setAdding(false);
    }
  };

  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (addingToWishlist) return;
    setAddingToWishlist(true);
    try {
      await addToWishlist(product.id);
      toast.success("Added to wishlist");
    } catch (err) {
      toast.error("Failed to add to wishlist");
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details-container">
      <ToastContainer />
      <div className="product-images-container">
        <div className="product-thumbnails">
          {allThumbnails.map((img, idx) => (
            <img
              key={`combined-thumb-${idx}`}
              src={img.image_url}
              alt={`combined-thumb-${idx}`}
              className="product-thumbnail-img"
              onClick={() => {
                if (selectedImage !== img.image_url) {
                  setSelectedImage(img.image_url);
                }
              }}
              title="Product thumbnail image"
            />
          ))}
        </div>
        <img
          key={selectedImageKey}
          src={selectedImage}
          alt="main product"
          className="product-main-img"
        />
      </div>

      {/* Right: Info */}
      <div className="product-info">
        <h2>{product.name}</h2>
        <p className="product-price">${product.price}</p>
        <p className="product-description">{product.description}</p>

        <div className="rating-container">
          {product.averageRating > 0 ? (
            <>
              <div className="">{renderStars(product.averageRating)}</div>
              <span className="">({product.averageRating} / 5)</span>
            </>
          ) : (
            <span className="no-ratings">No ratings yet</span>
          )}
        </div>

        <div className="color-selector">
          {product.ProductColors?.map((color, idx) => (
            <button
              key={idx}
              className={`color-button ${
                selectedColor?.id === color.id ? "selected" : "not-selected"
              }`}
              styles={{ backgroundColor: color.color_code }}
              onClick={() => handleColorSelect(color)}
              title={`Select ${color.color_name}`}
            ></button>
          ))}
        </div>

        {/* Quantity + Add to Cart */}
        <div className="action-buttons">
          <button
            className="action-button add-to-cart"
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
          <button
            className="action-button add-to-wishlist"
            onClick={handleAddToWishlist}
            disabled={addingToWishlist}
          >
            {addingToWishlist ? "Adding..." : "Add to Wishlist"}
          </button>
        </div>

        <div className="product-reviews-container">
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}
