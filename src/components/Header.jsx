import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <header>
      <div className="bg-akimat-blue text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between py-3">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold mr-6">
                {t("akimatTitle")}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-1.5 border border-white text-sm font-medium rounded-md text-white hover:bg-akimat-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  {t("dashboard")}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-1.5 border border-white text-sm font-medium rounded-md text-white hover:bg-akimat-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <nav className="px-4 py-2 space-y-2">
            <Link
              to="/"
              className="block py-2 text-akimat-blue font-medium hover:text-akimat-light-blue"
            >
              {t("mainPage")}
            </Link>
            <Link
              to="/services"
              className="block py-2 text-akimat-blue font-medium hover:text-akimat-light-blue"
            >
              {t("services")}
            </Link>
            <Link
              to="/documents"
              className="block py-2 text-akimat-blue font-medium hover:text-akimat-light-blue"
            >
              {t("documents")}
            </Link>
            <Link
              to="/contacts"
              className="block py-2 text-akimat-blue font-medium hover:text-akimat-light-blue"
            >
              {t("contacts")}
            </Link>
            {isAuthenticated && (
              <Link
                to="/requests"
                className="block py-2 text-akimat-blue font-medium hover:text-akimat-light-blue"
              >
                {t("myRequests")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
