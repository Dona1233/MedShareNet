import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const roleColor = {
    donor: 'bg-green-100 text-green-800',
    beneficiary: 'bg-blue-100 text-blue-800',
    admin: 'bg-red-100 text-red-800',
  };

  const dashboardLink = {
    donor: '/donor',
    beneficiary: '/beneficiary',
    admin: '/admin',
  };

  const navLinks = {
    donor: [
      { label: 'Dashboard', href: '/donor' },
      { label: 'Donate Resource', href: '/donor/add-resource' },
      { label: 'My Donations', href: '/donor/my-donations' },
    ],
    beneficiary: [
      { label: 'Dashboard', href: '/beneficiary' },
      { label: 'Browse Resources', href: '/beneficiary/browse' },
      { label: 'My Requests', href: '/beneficiary/my-requests' },
    ],
    admin: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Manage Resources', href: '/admin/resources' },
      { label: 'Manage Requests', href: '/admin/requests' },
    ],
  };

  const links = navLinks[user?.role] || [];
  const currentPath = window.location.pathname;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to={dashboardLink[user?.role] || '/'}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold text-gray-900">
              MedShareNet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  currentPath === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                roleColor[user?.role]
              }`}
            >
              {user?.role}
            </span>

            <span className="text-sm text-gray-600">
              {user?.name}
            </span>

            <Button
              variant="outline"
              onClick={logout}
              className="text-sm"
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    roleColor[user?.role]
                  }`}
                >
                  {user?.role}
                </span>

                <span className="text-sm text-gray-600">
                  {user?.name}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={logout}
                className="text-sm"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;