import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-green-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Our Voice, Our Rights
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  MGNREGA Performance Dashboard
                </p>
              </div>
            </Link>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "bg-india-green text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              <Link
                to="/info"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/info"
                    ? "bg-india-green text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Info
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-sm text-gray-300">
                Empowering rural India through transparent MGNREGA performance
                tracking.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Source</h3>
              <p className="text-sm text-gray-300">
                Government of India - Data.gov.in (MGNREGA API)
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <p className="text-sm text-gray-300">
                Made with care to empower rural India
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2025 Our Voice, Our Rights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
