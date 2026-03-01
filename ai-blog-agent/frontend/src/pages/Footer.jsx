import { Link } from "react-router-dom";

export default function Footer({ isDarkMode }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDarkMode
          ? "bg-black border-gray-800 text-gray-400"
          : "bg-white border-gray-200 text-gray-500"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span
              className={`font-black tracking-tighter text-xl uppercase mb-1 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              DailyScope
            </span>
            <p className="text-sm">
              &copy; {currentYear} Daily Scope. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <Link to="/about" className="hover:text-blue-500 transition-colors">
              About Us
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-500 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              className="hover:text-blue-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-500 transition-colors">
              Terms & Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
