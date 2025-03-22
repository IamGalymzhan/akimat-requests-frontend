import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../routes/routePaths.js";
import SidebarLanguageSwitcher from "../components/SidebarLanguageSwitcher";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      {
        name: t("dashboard"),
        href: ROUTES.DASHBOARD,
        icon: HomeIcon,
        highlight: [
          ROUTES.DASHBOARD,
          ROUTES.EMPLOYEE_DASHBOARD,
          ROUTES.SUPERVISOR_DASHBOARD,
          ROUTES.ADMIN_DASHBOARD,
        ],
      },
      {
        name: t("profile", "Profile"),
        href: ROUTES.PROFILE,
        icon: UserIcon,
        highlight: [ROUTES.PROFILE],
      },
    ];

    // Employee-specific items
    if (hasRole(ROLES.EMPLOYEE)) {
      return [
        ...commonItems,
        {
          name: t("myRequests", "My Requests"),
          href: ROUTES.MY_REQUESTS,
          icon: ClipboardDocumentListIcon,
          highlight: [ROUTES.MY_REQUESTS],
        },
        {
          name: t("requests", "Requests"),
          href: ROUTES.REQUESTS,
          icon: ClipboardDocumentCheckIcon,
          highlight: [ROUTES.REQUESTS],
        },
      ];
    }

    // Supervisor-specific items
    if (hasRole(ROLES.SUPERVISOR)) {
      return [
        ...commonItems,
        {
          name: t("requests", "All Requests"),
          href: ROUTES.REQUESTS,
          icon: ClipboardDocumentCheckIcon,
          highlight: [ROUTES.REQUESTS],
        },
      ];
    }

    // Admin-specific items
    if (hasRole(ROLES.ADMIN)) {
      return [
        ...commonItems,
        {
          name: t("userManagement", "User Management"),
          href: ROUTES.USER_MANAGEMENT,
          icon: UsersIcon,
          highlight: [ROUTES.USER_MANAGEMENT],
        },
        {
          name: t("requests", "Requests"),
          href: ROUTES.REQUESTS,
          icon: ClipboardDocumentListIcon,
          highlight: [ROUTES.REQUESTS],
        },
        {
          name: t("analytics", "Analytics"),
          href: ROUTES.ANALYTICS,
          icon: ChartBarIcon,
          highlight: [ROUTES.ANALYTICS],
        },
      ];
    }

    // Default navigation if role is not matched
    return commonItems;
  };

  const navigation = getNavigationItems();

  // Helper to check if a link should be highlighted
  const isLinkActive = (highlightPaths) => {
    return highlightPaths.some(
      (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`md:hidden ${sidebarOpen ? "fixed inset-0 z-40 flex" : ""}`}
      >
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition ease-in-out duration-300 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <Link to="/" className="text-xl font-bold text-akimat-blue">
              {t("akimatTitle")}
            </Link>
          </div>

          <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
            <div className="px-2 space-y-1 flex-grow">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isLinkActive(item.highlight)
                      ? "bg-akimat-blue text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      isLinkActive(item.highlight)
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon
                  className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {t("logout") || "Logout"}
              </button>
            </div>
            <div className="mt-auto px-4 py-4 border-t border-gray-200">
              <div className="flex justify-center">
                <SidebarLanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
              <Link to="/" className="text-xl font-bold text-akimat-blue">
                {t("akimatTitle")}
              </Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isLinkActive(item.highlight)
                        ? "bg-akimat-blue text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isLinkActive(item.highlight)
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <ArrowRightOnRectangleIcon
                    className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {t("logout") || "Logout"}
                </button>
              </nav>
              <div className="px-4 py-4 border-t border-gray-200">
                <div className="flex justify-center">
                  <SidebarLanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-akimat-blue"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
