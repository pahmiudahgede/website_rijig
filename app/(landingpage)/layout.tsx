// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   Menu,
//   X,
//   Search,
//   ChevronDown,
//   Facebook,
//   Twitter,
//   Linkedin,
//   Instagram,
//   Recycle,
//   ArrowUp
// } from "lucide-react";
// import { ModeToggle } from "@/components/mode-toggle";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const LandingLayout = ({ children }: LayoutProps) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       setIsScrolled(scrollTop > 300);
//       setShowBackToTop(scrollTop > 300);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth"
//     });
//   };

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <header
//         className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out
//         bg-white/95 backdrop-blur-md dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 shadow-sm
//         ${
//           isScrolled
//             ? "lg:bg-white/95 lg:backdrop-blur-md lg:dark:bg-gray-900/95 lg:border-b lg:border-gray-200 lg:dark:border-gray-700 lg:shadow-lg"
//             : "lg:bg-transparent lg:dark:bg-transparent lg:border-transparent lg:dark:border-transparent lg:shadow-none"
//         }
//       `}
//       >
//         <div className="container mx-auto max-w-[1400px] px-4">
//           <div className="flex items-center justify-between py-4">
//             {/* Logo */}
//             <div className="flex items-center space-x-2">
//               <div
//                 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500 
//                 bg-green-600
//                 ${
//                   isScrolled
//                     ? "lg:bg-green-600"
//                     : "lg:bg-white/90 lg:dark:bg-gray-800/90"
//                 }
//               `}
//               >
//                 <Recycle
//                   className={`h-5 w-5 transition-colors duration-500 
//                   text-white
//                   ${
//                     isScrolled
//                       ? "lg:text-white"
//                       : "lg:text-green-600 lg:dark:text-green-400"
//                   }
//                 `}
//                 />
//               </div>
//               <div
//                 className={`text-2xl font-bold transition-colors duration-500 
//                 text-black dark:text-white
//                 ${
//                   isScrolled
//                     ? "lg:text-black lg:dark:text-white"
//                     : "lg:text-white lg:dark:text-white lg:drop-shadow-lg"
//                 }
//               `}
//               >
//                 Rijig
//               </div>
//             </div>

//             {/* Mobile Menu Button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
//               onClick={toggleMenu}
//               aria-label="Toggle menu"
//             >
//               {isMenuOpen ? (
//                 <X className="h-5 w-5" />
//               ) : (
//                 <Menu className="h-5 w-5" />
//               )}
//             </Button>

//             {/* Desktop Navigation - Centered */}
//             <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
//               <div className="flex items-center space-x-8">
//                 <a
//                   href="#features"
//                   className={`text-base font-medium transition-colors duration-500 
//                     ${
//                       isScrolled
//                         ? "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
//                         : "text-white dark:text-white hover:text-green-200 dark:hover:text-green-300 drop-shadow-md"
//                     }`}
//                 >
//                   Fitur
//                 </a>
//                 <a
//                   href="#about"
//                   className={`text-base font-medium transition-colors duration-500 
//                     ${
//                       isScrolled
//                         ? "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
//                         : "text-white dark:text-white hover:text-green-200 dark:hover:text-green-300 drop-shadow-md"
//                     }`}
//                 >
//                   Tentang
//                 </a>
//                 <a
//                   href="#work-process"
//                   className={`text-base font-medium transition-colors duration-500 
//                     ${
//                       isScrolled
//                         ? "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
//                         : "text-white dark:text-white hover:text-green-200 dark:hover:text-green-300 drop-shadow-md"
//                     }`}
//                 >
//                   Cara Kerja
//                 </a>
//                 <a
//                   href="#testimonials"
//                   className={`text-base font-medium transition-colors duration-500 
//                     ${
//                       isScrolled
//                         ? "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
//                         : "text-white dark:text-white hover:text-green-200 dark:hover:text-green-300 drop-shadow-md"
//                     }`}
//                 >
//                   Testimoni
//                 </a>
//                 <a
//                   href="#support"
//                   className={`text-base font-medium transition-colors duration-500 
//                     ${
//                       isScrolled
//                         ? "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
//                         : "text-white dark:text-white hover:text-green-200 dark:hover:text-green-300 drop-shadow-md"
//                     }`}
//                 >
//                   Kontak
//                 </a>
//               </div>
//             </nav>

//             {/* Right Side Actions */}
//             <div className="hidden lg:flex items-center space-x-4">
//               {/* <Button
//                 variant="ghost"
//                 size="icon"
//                 aria-label="Search"
//                 className={`transition-colors duration-500 
//                   ${
//                     isScrolled
//                       ? "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
//                       : "text-white dark:text-white hover:bg-white/20 dark:hover:bg-white/20"
//                   }`}
//               >
//                 <Search className="h-4 w-4" />
//               </Button> */}
//               <ModeToggle />
//               <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
//                 Get Started!
//               </Button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           <div
//             className={`lg:hidden transition-all duration-300 ease-in-out ${
//               isMenuOpen
//                 ? "max-h-96 opacity-100 pb-4"
//                 : "max-h-0 opacity-0 overflow-hidden"
//             }`}
//           >
//             <nav className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//               <a
//                 href="#features"
//                 className="block text-base font-medium text-black dark:text-white hover:text-green-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Fitur
//               </a>
//               <a
//                 href="#about"
//                 className="block text-base font-medium text-black dark:text-white hover:text-green-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Tentang
//               </a>
//               <a
//                 href="#work-process"
//                 className="block text-base font-medium text-black dark:text-white hover:text-green-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Cara Kerja
//               </a>
//               <a
//                 href="#testimonials"
//                 className="block text-base font-medium text-black dark:text-white hover:text-green-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Testimoni
//               </a>
//               <a
//                 href="#support"
//                 className="block text-base font-medium text-black dark:text-white hover:text-green-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Kontak
//               </a>

//               <Separator className="my-4" />

//               {/* Mobile Actions */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   {/* <Button variant="ghost" size="icon" aria-label="Search">
//                     <Search className="h-4 w-4" />
//                   </Button> */}
//                   <ModeToggle />
//                 </div>
//                 <Button
//                   size="sm"
//                   className="bg-green-600 hover:bg-green-700 text-white"
//                 >
//                   Get Started!
//                 </Button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main>{children}</main>

//       {/* Back to Top Button */}
//       <Button
//         onClick={scrollToTop}
//         className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300 ${
//           showBackToTop
//             ? "opacity-100 translate-y-0"
//             : "opacity-0 translate-y-2 pointer-events-none"
//         }`}
//         aria-label="Back to top"
//       >
//         <ArrowUp className="h-5 w-5" />
//       </Button>

//       {/* Footer */}
//       <footer className="bg-green-50 dark:bg-gray-800">
//         <div className="container mx-auto max-w-[1390px] px-4 py-8">
//           <div className="grid lg:grid-cols-12 gap-8">
//             <div className="lg:col-span-5">
//               <div className="mb-8">
//                 <div className="flex items-center space-x-2 mb-4">
//                   <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
//                     <Recycle className="h-5 w-5 text-white" />
//                   </div>
//                   <div className="text-2xl font-bold text-black dark:text-white">
//                     Rijig
//                   </div>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-300 max-w-[320px]">
//                   Platform pengelolaan sampah terpadu yang menghubungkan
//                   masyarakat, pengepul, dan pengelola untuk ekonomi sirkular
//                   berkelanjutan.
//                 </p>
//               </div>
//             </div>

//             {/* <div className="lg:col-span-7">
//               <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
//                 <div>
//                   <h3 className="text-xl font-medium text-black dark:text-white mb-6">
//                     Fitur
//                   </h3>
//                   <ul className="space-y-3 text-gray-600 dark:text-gray-300">
//                     <li>
//                       <a
//                         href="#features"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Untuk Masyarakat
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#features"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Untuk Pengepul
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#features"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Untuk Pengelola
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#screens"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Screenshot App
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-medium text-black dark:text-white mb-6">
//                     Tentang Kami
//                   </h3>
//                   <ul className="space-y-3 text-gray-600 dark:text-gray-300">
//                     <li>
//                       <a
//                         href="#about"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Visi & Misi
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#testimonials"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Testimoni
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Tim Rijig
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Karir
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-medium text-black dark:text-white mb-6">
//                     Sumber Daya
//                   </h3>
//                   <ul className="space-y-3 text-gray-600 dark:text-gray-300">
//                     <li>
//                       <a
//                         href="#blog"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Artikel & Tips
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#faq"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         FAQ
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#support"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Bantuan
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Panduan Pengguna
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-medium text-black dark:text-white mb-6">
//                     Komunitas
//                   </h3>
//                   <ul className="space-y-3 text-gray-600 dark:text-gray-300">
//                     <li>
//                       <a
//                         href="#"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Forum Diskusi
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Event & Webinar
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Program Kemitraan
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="#"
//                         className="hover:text-green-600 transition-colors"
//                       >
//                         Media Kit
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         </div>

//         <div className="bg-green-600 dark:bg-green-700 py-6">
//           <div className="container mx-auto max-w-[1390px] px-4">
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <p className="text-white text-center md:text-left mb-4 md:mb-0">
//                 © 2025 Rijig.
//               </p>

//               <div className="flex items-center space-x-6">
//                 <div className="flex items-center space-x-4">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-white hover:text-white/80 hover:bg-green-700"
//                   >
//                     <Facebook className="h-5 w-5" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-white hover:text-white/80 hover:bg-green-700"
//                   >
//                     <Twitter className="h-5 w-5" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-white hover:text-white/80 hover:bg-green-700"
//                   >
//                     <Linkedin className="h-5 w-5" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-white hover:text-white/80 hover:bg-green-700"
//                   >
//                     <Instagram className="h-5 w-5" />
//                   </Button>
//                 </div>

//                 <div className="flex items-center space-x-6 text-white text-sm">
//                   <a href="#" className="hover:text-white/80 transition-colors">
//                     Kebijakan Privasi
//                   </a>
//                   <a href="#" className="hover:text-white/80 transition-colors">
//                     Syarat & Ketentuan
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingLayout;

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {children}
    </div>
  );
}