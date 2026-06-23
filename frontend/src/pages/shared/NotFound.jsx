import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();

  const dashboardLink = user
    ? `/${user.role}`
    : '/login';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🏥</div>

        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          404
        </h1>

        <p className="text-xl text-gray-500 mb-2">
          Page not found
        </p>

        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to={dashboardLink}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition duration-200"
        >
          {user ? 'Back to Dashboard' : 'Go to Login'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;