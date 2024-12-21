import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/manage", label: "Question Management" },
    { href: "/take-quiz", label: "Take Quiz" },
    { href: "/results", label: "Results" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200",
                  location.pathname === link.href
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600"
                  />
                )}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;