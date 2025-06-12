'use client'
import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";
import Form from "next/form"
import { PackageIcon, MenuIcon } from "@sanity/icons";
import { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart, FiSearch, FiHome, FiX } from 'react-icons/fi'
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
    const itemCount = cartItems.length
    

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

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
                    {/* Mobile Menu Button */}
                    <Button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </Button>

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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link
                            href="/"
                            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-[#1a3fa6] hover:text-[#1a3fa6] transition-all duration-300 text-sm font-medium"
                        >
                            <FiHome className="w-4 h-4 mr-2" />
                            <span>Home</span>
                        </Link>

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
                                    className="absolute -top-1 -right-1 bg-[#e11d48] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold border-2 border-white px-1"
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
                                    className="absolute -top-1 -right-1 bg-[#e11d48] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold border-2 border-white px-1"
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

                {/* Mobile Menu - Full Screen Sidebar */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 20 }}
                            className="fixed inset-0 bg-white z-50 md:hidden"
                        >
                            <div className="h-full flex flex-col">
                                {/* Header with close button */}
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h2 className="text-xl font-bold text-[#1a3fa6]">Menu</h2>
                                    <Button 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 rounded-full hover:bg-gray-100"
                                    >
                                        <FiX className="h-6 w-6" />
                                    </Button>
                                </div>

                                {/* Search Bar */}
                                <div className="p-4 border-b">
                                    <Form action="/search" className="w-full">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                name="query"
                                                placeholder="Search for products..."
                                                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#1a3fa6] focus:border-transparent bg-gray-50"
                                            />
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </Form>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    <Link
                                        href="/"
                                        className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiHome className="w-5 h-5 mr-3" />
                                        <span className="font-medium">Home</span>
                                    </Link>

                                    <Link
                                        href="/about"
                                        className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="font-medium">About</span>
                                    </Link>

                                    <Link
                                        href="/wishlist"
                                        className="relative flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiHeart className="w-5 h-5 mr-3 text-[#b91c1c]" />
                                        <span className="font-medium">Wishlist</span>
                                        {wishlistItems.length > 0 && (
                                            <span className="absolute top-3 right-4 bg-[#e11d48] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold border-2 border-white px-1">
                                                {wishlistItems.length}
                                            </span>
                                        )}
                                    </Link>

                                    <Link
                                        href="/cart"
                                        className="relative flex items-center px-4 py-3 bg-[#1a3fa6] text-white rounded-full hover:bg-[#2563eb] transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiShoppingCart className="w-5 h-5 mr-3" />
                                        <span className="font-medium">Cart</span>
                                        {itemCount > 0 && (
                                            <span className="absolute top-3 right-4 bg-[#e11d48] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold border-2 border-white px-1">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Link>

                                    <ClerkLoaded>
                                        <SignedIn>
                                            <Link
                                                href="/orders"
                                                className="flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-300"
                                                onClick={() => setIsMenuOpen(false)}
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
                                                <Button 
                                                    className="w-full px-4 py-3 bg-[#1a3fa6] text-white rounded-full hover:bg-[#2563eb] transition-all duration-300"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
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