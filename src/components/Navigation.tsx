import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, Brain } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/manage", label: "Question Management" },
    { href: "/take-quiz", label: "Take Quiz" },
    { href: "/results", label: "Results" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {isMobile ? (
            <>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <ThemeToggle />
            </>
          ) : (
            <>
              <Link
                to="/"
                className={cn(
                  "flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
                  location.pathname === "/" && "text-blue-600 dark:text-blue-400"
                )}
              >
                <Brain className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full",
                      location.pathname === link.href
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <ThemeToggle />
              </div>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-4 space-y-2"
          >
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 text-base font-medium rounded-md transition-colors",
                location.pathname === "/"
                  ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <Brain className="w-5 h-5" />
              <span>Home</span>
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-2 text-base font-medium rounded-md transition-colors",
                  location.pathname === link.href
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;