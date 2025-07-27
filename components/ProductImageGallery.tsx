'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

type Props = {
  images: any[] // Or SanityImage[]
}

const ProductImageGallery = ({ images }: Props) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0])

  return (
    <>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50 shadow-lg">
        {selectedImage && (
          <Image
            src={urlFor(selectedImage).url()}
            alt="Selected product image"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex mt-4 space-x-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`relative w-16 h-16 rounded-md border-2 ${
              img === selectedImage ? 'border-blue-600' : 'border-transparent'
            }`}
          >
            <Image
              src={urlFor(img).url()}
              alt={`Thumb ${i + 1}`}
              fill
              className="object-cover rounded"
            />
          </button>
        ))}
      </div>
    </>
  )
}

export default ProductImageGallery
