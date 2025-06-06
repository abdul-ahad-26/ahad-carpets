'use client'
import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";
import Form from "next/form"
import { PackageIcon, MenuIcon } from "@sanity/icons";
import { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart, FiSearch } from 'react-icons/fi'
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { motion, AnimatePresence } from "framer-motion"

function Header() {
    const { user } = useUser()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { items: cartItems } = useCart()
    const { items: wishlistItems } = useWishlist()

    // Calculate total items in cart
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`bg-white shadow-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
                isScrolled ? 'shadow-lg' : 'shadow-sm'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-[20px] md:text-[24px] font-bold text-[#1a3fa6] hover:text-[#0d1e4a] transition-all duration-300 transform hover:scale-105"
                        style={{ letterSpacing: 0.2 }}
                    >
                        Ahad Carpets
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <Form action="/search" className="w-full relative group">
                            <input 
                                type="text" 
                                name="query"
                                placeholder="Search for products..."
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#1a3fa6] focus:border-[#1a3fa6] text-sm transition-all duration-300 bg-gray-50 group-hover:bg-white"
                                style={{ background: "#f8f9fa" }}
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#1a3fa6] transition-colors duration-300" />
                        </Form>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </Button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link
                            href="/about"
                            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-[#1a3fa6] hover:text-[#1a3fa6] transition-all duration-300 text-sm font-medium"
                        >
                            <span>About</span>
                        </Link>

                        <Link
                            href="/wishlist"
                            className="relative flex items-center px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-[#1a3fa6] hover:text-[#1a3fa6] transition-all duration-300 text-sm font-medium"
                        >
                            <FiHeart className="w-4 h-4 mr-2 text-[#b91c1c]" />
                            <span>Wishlist</span>
                            {wishlistItems.length > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-[#e11d48] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white"
                                >
                                    {wishlistItems.length}
                                </motion.span>
                            )}
                        </Link>

                        <Link
                            href="/cart"
                            className="relative flex items-center px-4 py-2 bg-[#1a3fa6] text-white rounded-full hover:bg-[#2563eb] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                        >
                            <FiShoppingCart className="w-4 h-4 mr-2" />
                            <span>Cart</span>
                            {itemCount > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-[#e11d48] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white"
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </Link>

                        <ClerkLoaded>
                            <SignedIn>
                                <Link
                                    href="/orders"
                                    className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-[#1a3fa6] hover:text-[#1a3fa6] transition-all duration-300 text-sm font-medium"
                                >
                                    <PackageIcon className="w-4 h-4 mr-2" />
                                    <span>Orders</span>
                                </Link>
                            </SignedIn>

                            {user ? (
                                <div className="flex items-center space-x-3 ml-2">
                                    <UserButton />
                                    <div className="text-sm">
                                        <p className="text-gray-500">Welcome</p>
                                        <p className="font-semibold">{user.fullName}</p>
                                    </div>
                                </div>
                            ) : (
                                <SignInButton mode="modal">
                                    <Button className="px-4 py-2 transition-all duration-300 bg-[#1a3fa6] text-white rounded-full hover:bg-[#2563eb] shadow-md hover:shadow-lg">
                                        Sign In
                                    </Button>
                                </SignInButton>
                            )}
                        </ClerkLoaded>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-4">
                                <Form action="/search" className="w-full mb-4">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            name="query"
                                            placeholder="Search for products..."
                                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#1a3fa6] focus:border-transparent bg-gray-50"
                                        />
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </Form>
                                
                                <div className="flex flex-col space-y-3">
                                    <Link
                                        href="/about"
                                        className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <span className="font-medium">About</span>
                                    </Link>

                                    <Link
                                        href="/wishlist"
                                        className="relative flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <FiHeart className="w-5 h-5 mr-3 text-[#b91c1c]" />
                                        <span className="font-medium">Wishlist</span>
                                        {wishlistItems.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-[#e11d48] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white">
                                                {wishlistItems.length}
                                            </span>
                                        )}
                                    </Link>

                                    <Link
                                        href="/cart"
                                        className="relative flex items-center px-4 py-3 bg-[#1a3fa6] text-white rounded-full hover:bg-[#2563eb] transition-all duration-300"
                                    >
                                        <FiShoppingCart className="w-5 h-5 mr-3" />
                                        <span className="font-medium">Cart</span>
                                        {itemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-[#e11d48] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Link>

                                    <ClerkLoaded>
                                        <SignedIn>
                                            <Link
                                                href="/orders"
                                                className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300"
                                            >
                                                <PackageIcon className="w-5 h-5 mr-3" />
                                                <span className="font-medium">Orders</span>
                                            </Link>
                                        </SignedIn>

                                        {user ? (
                                            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-full">
                                                <UserButton />
                                                <div className="text-sm">
                                                    <p className="text-gray-500">Welcome</p>
                                                    <p className="font-semibold">{user.fullName}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <SignInButton mode="modal">
                                                <Button className="w-full px-4 py-3 bg-[#1a3fa6] text-white rounded-full hover:bg-[#2563eb] transition-all duration-300">
                                                    Sign In
                                                </Button>
                                            </SignInButton>
                                        )}
                                    </ClerkLoaded>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}

export default Header