import React, { useState, useEffect } from "react";
import { ProductItem } from "@/types";

interface ProductImageProps {
  product: ProductItem;
  className?: string;
  loading?: "lazy" | "eager";
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  className = "h-full w-full object-cover object-center",
  loading = "lazy",
}) => {
  const initialSrc = product.localSrc || product.image || product.url;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);

  useEffect(() => {
    setCurrentSrc(product.localSrc || product.image || product.url);
  }, [product]);

  const handleError = () => {
    if (product.localSrc && currentSrc !== product.localSrc) {
      setCurrentSrc(product.localSrc);
    } else if (product.url && currentSrc !== product.url) {
      setCurrentSrc(product.url);
    } else if (product.image && currentSrc !== product.image) {
      setCurrentSrc(product.image);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={product.alt || product.name}
      referrerPolicy="no-referrer"
      loading={loading}
      onError={handleError}
      className={className}
    />
  );
};
