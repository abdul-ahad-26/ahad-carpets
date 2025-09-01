'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { Product } from '@/sanity.types'
import { PlayCircle } from 'lucide-react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types' // ✅ Built-in type

interface ProductImageGalleryProp {
  product: Product
}

// ✅ Use union type with proper Sanity type for image
type MediaType =
  | { type: 'image'; value: SanityImageSource; key: string }
  | { type: 'video'; value: string; key: string }

const ProductImageGallery = ({ product }: ProductImageGalleryProp) => {
  const media: MediaType[] = []

  // Add video first if available
  if (product.videoUrl) {
    media.push({ type: 'video', value: product.videoUrl, key: `video-${product.videoUrl}` })
  }

  // Add images
  if (product.images?.length) {
    media.push(
      ...product.images.map((img, i) => ({
        type: 'image'as const,
        value: img,
        key: `image-${i}`,
      }))
    )
  }

  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedMedia = media[selectedIndex]

  // Converts youtube/shorts/youtu.be URLs to embed format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('/shorts/')[1]?.split(/[?&]/)[0]
      return `https://www.youtube.com/embed/${id}`
    } else if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/')
    } else if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0]
      return `https://www.youtube.com/embed/${id}`
    }
    return url
  }

  // Get YouTube thumbnail
  const getVideoThumbnail = (url: string) => {
    let id: string | undefined
    if (url.includes('youtube.com/shorts/')) {
      id = url.split('/shorts/')[1]?.split(/[?&]/)[0]
    } else if (url.includes('watch?v=')) {
      id = url.split('watch?v=')[1]?.split(/[?&]/)[0]
    } else if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1]?.split(/[?&]/)[0]
    }
    return id
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : '/fallback-video-thumb.jpg'
  }

  return (
    <div className="flex gap-4">
      {/* Left Thumbnails */}
      <div className="flex flex-col space-y-2 overflow-y-auto max-h-[500px]">
        {media.map((item, i) => {
          const isSelected = i === selectedIndex
          return (
            <button
              key={item.key}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-16 h-16 rounded-md border-2 ${
                isSelected ? 'border-black' : 'border-transparent'
              }`}
            >
              {item.type === 'image' ? (
                <Image
                  src={urlFor(item.value).url()}
                  alt={`Thumb ${i + 1}`}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <div className="relative w-full h-full rounded overflow-hidden">
                  <Image
                    src={getVideoThumbnail(item.value)}
                    alt="Video thumbnail"
                    fill
                    className="object-cover"
                  />
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Main Media */}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl bg-gray-50 shadow-lg">
        {selectedMedia.type === 'image' ? (
          <Image
            src={urlFor(selectedMedia.value).url()}
            alt="Selected product image"
            fill
            className="object-cover"
          />
        ) : (
          <iframe
            src={getEmbedUrl(selectedMedia.value)}
            className="w-full h-full rounded-3xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  )
}

export default ProductImageGallery
