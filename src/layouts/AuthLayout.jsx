import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Your App Name
            </h2>
          </Link>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your application tagline or description
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
