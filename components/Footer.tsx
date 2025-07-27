'use client'

import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    // Here you would typically handle the newsletter subscription
    toast.success("Thank you for subscribing!")
    setEmail("")
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Ahad Carpets
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted source for high-quality carpets and rugs. We bring you the finest selection of handcrafted carpets from around the world.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-white text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center text-gray-400 hover:text-white transition-all duration-300 group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-white text-xl font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 group">
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-blue-600 transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">+92 317029405</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-blue-600 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">info@ahadcarpets.com</span>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-blue-600 transition-all duration-300 mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">123 Carpet Street, City, Country</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-white text-xl font-semibold">Newsletter</h3>
            <p className="text-gray-400">
              Subscribe to our newsletter for updates and special offers.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-lg hover:shadow-blue-500/20"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 mt-16 pt-8 text-sm text-center"
        >
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Ahad Carpets. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
} 