/**
 * Utility functions for handling image URLs across dev and prod environments
 */

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "/images/placeholder.png";
  
  // If it's already a full URL, return as is
  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }
  
  // Clean up the path - remove leading slashes
  const cleanPath = imagePath.replace(/^\/+/, "");
  
  // For uploaded images, return both local and remote URLs
  // The img tag will try local first, then fallback to remote
  if (cleanPath.startsWith('produits/') || cleanPath.startsWith('brands/') || 
      cleanPath.startsWith('categories/') || cleanPath.startsWith('uploads/')) {
    return `/${cleanPath}`; // Try local first
  }
  
  // For other static images, use local path
  return `/${cleanPath}`;
}

export function getRemoteImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "";
  const cleanPath = imagePath.replace(/^\/+/, "");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://145.223.118.9:5000';
  return `${backendUrl}/${cleanPath}`;
}

// Legacy compatibility - handles old path formats
export function getImageSrc(entity: Record<string, unknown>): string {
  if (!entity) return "/images/placeholder.png";
  
  // Handle different image field names
  const imageFields = ['cover', 'mainImage', 'image', 'icon', 'logo'];
  
  for (const field of imageFields) {
    if (entity[field]) {
      if (typeof entity[field] === 'object' && entity[field] && typeof (entity[field] as Record<string, unknown>).url === 'string') {
        return getImageUrl((entity[field] as Record<string, unknown>).url as string);
      }
      if (typeof entity[field] === 'string') {
        return getImageUrl(entity[field] as string);
      }
    }
  }
  
  return "/images/placeholder.png";
}

export function getProductImageUrl(product: Record<string, unknown>): string {
  return getImageSrc(product);
}

export function getProductImageWithFallback(product: Record<string, unknown>): { src: string; fallback: string } {
  const imagePath = getImageSrc(product);
  if (imagePath === "/images/placeholder.png") {
    return { src: imagePath, fallback: "" };
  }
  
  const cleanPath = imagePath.replace(/^\/+/, "");
  if (cleanPath.startsWith('produits/') || cleanPath.startsWith('brands/') || 
      cleanPath.startsWith('categories/') || cleanPath.startsWith('uploads/')) {
    return {
      src: `/${cleanPath}`, // Local first
      fallback: getRemoteImageUrl(cleanPath) // Remote fallback
    };
  }
  
  return { src: imagePath, fallback: "" };
}

export function getCategoryImageWithFallback(category: Record<string, unknown>): { src: string; fallback: string } {
  // Priority 1: New uploaded images (start with /categories/)
  if (typeof category.cover === 'string' && category.cover.startsWith('/categories/')) {
    const cleanPath = category.cover.replace(/^\/+/, "");
    return {
      src: `/${cleanPath}`, // Local first
      fallback: getRemoteImageUrl(cleanPath) // Remote fallback
    };
  }
  
  // Priority 2: SVG icons by ID
  if (typeof category.id === 'string' && category.id !== "") {
    return { src: `/images/categories/${category.id}.svg`, fallback: "" };
  }
  
  // Priority 3: Old PNG images by cover filename
  if (typeof category.cover === 'string' && category.cover !== "") {
    return { src: `/images/categories/${category.cover.split('/').pop()}`, fallback: "" };
  }
  
  // Fallback: Placeholder
  return { src: "/images/placeholder.png", fallback: "" };
}

export function getBrandImageWithFallback(brand: Record<string, unknown>): { src: string; fallback: string } {
  const logo = brand.logo || brand.cover;
  
  // Priority 1: New uploaded images (start with /brands/)
  if (typeof logo === 'string' && logo.startsWith('/brands/')) {
    const cleanPath = logo.replace(/^\/+/, "");
    return {
      src: `/${cleanPath}`, // Local first
      fallback: getRemoteImageUrl(cleanPath) // Remote fallback
    };
  }
  
  // Priority 2: HTTP URLs
  if (typeof logo === 'string' && logo.startsWith('http')) {
    return { src: logo, fallback: "" };
  }
  
  // Priority 3: Old dashboard format (brands/April2025/file.webp)
  if (typeof logo === 'string' && logo !== "") {
    return { src: logo.startsWith('/') ? logo : `/dashboard/${logo}`, fallback: "" };
  }
  
  // Fallback: Placeholder
  return { src: "/images/placeholder.png", fallback: "" };
}

export function getBlogImageWithFallback(blog: Record<string, unknown>): { src: string; fallback: string } {
  const cover = blog.cover;
  
  // Priority 1: New uploaded images (start with /blogs/)
  if (typeof cover === "string" && cover.startsWith('/blogs/')) {
    const cleanPath = cover.replace(/^\/+/, "");
    return {
      src: `/${cleanPath}`, // Local first
      fallback: getRemoteImageUrl(cleanPath) // Remote fallback
    };
  }
  
  // Priority 2: Object format with URL
  if (typeof cover === "object" && cover && typeof (cover as Record<string, unknown>).url === 'string') {
    const url = (cover as Record<string, unknown>).url as string;
    if (url.startsWith("http")) {
      return { src: url, fallback: "" };
    } else {
      return { src: url, fallback: "" };
    }
  }
  
  // Priority 3: Old uploads format (articles/February2025/file.webp)
  if (typeof cover === "string" && cover !== "") {
    return { src: cover.startsWith('/') ? cover : `/uploads/${cover}`, fallback: "" };
  }
  
  // Fallback: Placeholder
  return { src: "/images/placeholder.png", fallback: "" };
}

export function getPackImageWithFallback(pack: Record<string, unknown>): { src: string; fallback: string } {
  // Priority 1: mainImage object with URL
  if (typeof pack.mainImage === 'object' && pack.mainImage && typeof (pack.mainImage as Record<string, unknown>).url === 'string') {
    const url = (pack.mainImage as Record<string, unknown>).url as string;
    if (url.startsWith('/packs/')) {
      const cleanPath = url.replace(/^\/+/, "");
      return {
        src: `/${cleanPath}`, // Local first
        fallback: getRemoteImageUrl(cleanPath) // Remote fallback
      };
    }
    return { src: url, fallback: "" };
  }
  
  // Priority 2: cover field
  if (typeof pack.cover === 'string' && pack.cover !== "undefined") {
    // New uploaded images (start with /packs/)
    if (pack.cover.startsWith('/packs/')) {
      const cleanPath = pack.cover.replace(/^\/+/, "");
      return {
        src: `/${cleanPath}`, // Local first
        fallback: getRemoteImageUrl(cleanPath) // Remote fallback
      };
    }
    
    // HTTP URLs or absolute paths
    if (pack.cover.startsWith('http') || pack.cover.startsWith('/')) {
      return { src: pack.cover, fallback: "" };
    }
    
    // Old format - relative paths
    return { src: `/${pack.cover.replace(/^\/+/, "")}`, fallback: "" };
  }
  
  // Fallback: Placeholder
  return { src: "/images/placeholder.png", fallback: "" };
}

export function getCoordinatesImageWithFallback(coordinates: Record<string, unknown>, imageField: string): { src: string; fallback: string } {
  const imagePath = coordinates[imageField];
  
  if (!imagePath || typeof imagePath !== 'string') {
    return { src: "/images/placeholder.png", fallback: "" };
  }
  
  // Priority 1: New uploaded images (start with /coordonnees/)
  if (imagePath.startsWith('/coordonnees/')) {
    const cleanPath = imagePath.replace(/^\/+/, "");
    return {
      src: `/${cleanPath}`, // Local first
      fallback: getRemoteImageUrl(cleanPath) // Remote fallback
    };
  }
  
  // Priority 2: HTTP URLs
  if (imagePath.startsWith('http')) {
    return { src: imagePath, fallback: "" };
  }
  
  // Priority 3: Absolute paths - try both local and remote
  if (imagePath.startsWith('/')) {
    return {
      src: imagePath, // Local first
      fallback: getRemoteImageUrl(imagePath.replace(/^\/+/, "")) // Remote fallback
    };
  }
  
  // Priority 4: Old format - relative paths - try both local and remote
  const cleanPath = imagePath.replace(/^\/+/, "");
  return {
    src: `/${cleanPath}`, // Local first
    fallback: getRemoteImageUrl(cleanPath) // Remote fallback
  };
}

export function getAnnouncesImageWithFallback(announce: Record<string, unknown>, imageField: string): { src: string; fallback: string } {
  const imagePath = announce[imageField];
  
  if (!imagePath || typeof imagePath !== 'string') {
    return { src: "/images/placeholder.png", fallback: "" };
  }
  
  // Priority 1: New uploaded images (start with /annonces/)
  if (imagePath.startsWith('/annonces/')) {
    const cleanPath = imagePath.replace(/^\/+/, "");
    return {
      src: `/${cleanPath}`, // Local first
      fallback: getRemoteImageUrl(cleanPath) // Remote fallback
    };
  }
  
  // Priority 2: HTTP URLs
  if (imagePath.startsWith('http')) {
    return { src: imagePath, fallback: "" };
  }
  
  // Priority 3: Absolute paths - try both local and remote
  if (imagePath.startsWith('/')) {
    return {
      src: imagePath, // Local first
      fallback: getRemoteImageUrl(imagePath.replace(/^\/+/, "")) // Remote fallback
    };
  }
  
  // Priority 4: Old format - relative paths - try both local and remote
  const cleanPath = imagePath.replace(/^\/+/, "");
  return {
    src: `/${cleanPath}`, // Local first
    fallback: getRemoteImageUrl(cleanPath) // Remote fallback
  };
}

export function getSlidesImageWithFallback(slide: Record<string, unknown>): { src: string; fallback: string } {
  const imagePath = slide.cover;
  
  if (!imagePath || typeof imagePath !== 'string') {
    return { src: "/images/placeholder.png", fallback: "" };
  }
  
  // Priority 1: New uploaded images (start with /slides/)
  if (imagePath.startsWith('/slides/')) {
    const cleanPath = imagePath.replace(/^\/+/, "");
    return {
      src: `/${cleanPath}`, // Local first
      fallback: getRemoteImageUrl(cleanPath) // Remote fallback
    };
  }
  
  // Priority 2: HTTP URLs
  if (imagePath.startsWith('http')) {
    return { src: imagePath, fallback: "" };
  }
  
  // Priority 3: Absolute paths
  if (imagePath.startsWith('/')) {
    return {
      src: imagePath,
      fallback: getRemoteImageUrl(imagePath.replace(/^\/+/, ""))
    };
  }
  
  // Priority 4: Relative paths
  const cleanPath = imagePath.replace(/^\/+/, "");
  return {
    src: `/${cleanPath}`,
    fallback: getRemoteImageUrl(cleanPath)
  };
}

export function getServicesImageWithFallback(service: Record<string, unknown>): { src: string; fallback: string } {
  const cover = service.cover;
  
  if (!cover || typeof cover !== 'string') {
    return { src: "/images/placeholder.png", fallback: "" };
  }
  
  // Priority 1: New uploaded images (start with /services/)
  if (cover.startsWith('/services/')) {
    const cleanPath = cover.replace(/^\/+/, "");
    return {
      src: `/${cleanPath}`, // Local first
      fallback: getRemoteImageUrl(cleanPath) // Remote fallback
    };
  }
  
  // Priority 2: HTTP URLs
  if (cover.startsWith('http')) {
    return { src: cover, fallback: "" };
  }
  
  // Priority 3: Absolute paths
  if (cover.startsWith('/')) {
    return {
      src: cover,
      fallback: getRemoteImageUrl(cover.replace(/^\/+/, ""))
    };
  }
  
  // Priority 4: Relative paths
  const cleanPath = cover.replace(/^\/+/, "");
  return {
    src: `/${cleanPath}`,
    fallback: getRemoteImageUrl(cleanPath)
  };
}