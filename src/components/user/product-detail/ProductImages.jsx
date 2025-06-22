import React from "react";

const ProductImages = ({ product, selectedImage, hoveredImage, setSelectedImage, setHoveredImage }) => {
  return (
    <div className="product-images-container" style={{ flex: "1", minWidth: "300px" }}>
      <div className="main-image-container" style={{ position: "relative", marginBottom: "20px" }}>
        <div className="main-image" style={{ position: "relative", marginBottom: "10px" }}>
          <img
            src={
              hoveredImage !== null && product.imageUrls?.[hoveredImage]
                ? product.imageUrls[hoveredImage]
                : product.imageUrls?.[selectedImage] || "/placeholder.svg?height=300&width=300"
            }
            alt={product.name}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
          {product.discount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "#f50",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
              }}
            >
              -{product.discount}%
            </div>
          )}
        </div>
      </div>
      <div className="thumbnails" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {product.imageUrls?.map((url, index) => (
          <div
            key={index}
            className={`thumbnail ${selectedImage === index ? "active" : ""}`}
            onClick={() => setSelectedImage(index)}
            onMouseEnter={() => setHoveredImage(index)}
            onMouseLeave={() => setHoveredImage(null)}
            style={{
              width: "60px",
              height: "60px",
              border: `2px solid ${selectedImage === index ? "#1890ff" : "#ddd"}`,
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <img
              src={url || "/placeholder.svg?height=60&width=60"}
              alt={`Thumbnail ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
            />
          </div>
        )) || (
          <div className="thumbnail">
            <img
              src="/placeholder.svg?height=60&width=60"
              alt="No thumbnail"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImages;