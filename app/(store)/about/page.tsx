'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Award, Heart, Shield} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AboutPage() {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Our Story
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Crafting exceptional carpets with passion and precision since 1990. 
          We bring the rich heritage of carpet making into modern homes.
        </p>
      </motion.div>

      {/* Main Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative w-full h-[500px] mb-20 rounded-2xl overflow-hidden shadow-2xl"
      >
        <Image
          src="/images/about-hero.jpg"
          alt="Carpet making process"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          className="object-cover hover:scale-105 transition-transform duration-700"
          priority
          onError={() => setImageError(true)}
        />
        {imageError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Image failed to load</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </motion.div>

      {/* Values Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          {
            icon: <Award className="w-12 h-12 text-blue-600 mb-4" />,
            title: "Quality Craftsmanship",
            description: "Every carpet is handcrafted with meticulous attention to detail, ensuring the highest standards of quality."
          },
          {
            icon: <Heart className="w-12 h-12 text-red-600 mb-4" />,
            title: "Customer First",
            description: "We prioritize your satisfaction, offering personalized service and support throughout your journey with us."
          },
          {
            icon: <Shield className="w-12 h-12 text-green-600 mb-4" />,
            title: "Sustainable Practices",
            description: "Committed to eco-friendly production methods and sustainable sourcing of materials."
          }
        ].map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {value.icon}
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{value.title}</h3>
            <p className="text-gray-600 leading-relaxed">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Story Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 mb-20 shadow-lg"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Journey
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              Founded in 1990, our company began with a simple mission: to create 
              beautiful, high-quality carpets that would stand the test of time. 
              What started as a small family workshop has grown into a respected 
              name in the carpet industry.
            </p>
            <p className="text-lg">
              Today, we continue to honor our traditional craftsmanship while 
              embracing modern techniques and designs. Our carpets are more than 
              just floor coverings – they&apos;re pieces of art that tell stories and 
              create memories.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <div className="mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Abdullah Saleem",
              role: "Master Craftsman",
              image: "/images/team-1.jpg"
            },
            {
              name: "Ahmed khan",
              role: "Design Director",
              image: "/images/team-2.jpg"
            },
            {
              name: "Mohammad Imran",
              role: "Quality Control",
              image: "/images/team-3.jpg"
            }
          ].map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center group"
            >
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 object-fill">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 shadow-xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Experience Our Collection
        </h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
          Discover our handcrafted carpets and find the perfect piece for your home.
        </p>
        <Link href="/store">
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
            View Our Collection
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
} 