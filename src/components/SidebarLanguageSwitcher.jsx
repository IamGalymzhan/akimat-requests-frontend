import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const SidebarLanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "kk", name: "Қазақша" },
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[2];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="text-xs text-center text-gray-500 mb-2">
        {t("language", "Language")}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue"
      >
        <div className="flex items-center">
          <GlobeAltIcon
            className="w-5 h-5 mr-2 text-akimat-blue"
            aria-hidden="true"
          />
          <span>{currentLanguage.name}</span>
        </div>
        <ChevronUpIcon
          className={`w-5 h-5 ml-2 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 z-10 mb-2 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2 text-sm text-left ${
                  i18n.language === lang.code
                    ? "bg-akimat-blue text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarLanguageSwitcher;
