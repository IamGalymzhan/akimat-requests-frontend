import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-32 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        <span>{currentLanguage.name}</span>
        <ChevronDownIcon
          className="w-5 h-5 ml-2 -mr-1 text-gray-400"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-32 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                    ? "bg-sky-100 text-sky-900"
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

export default LanguageSwitcher;
