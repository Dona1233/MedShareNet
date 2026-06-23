import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      // Redirect based on role
      const role = res.data.user.role;
      if (role === 'donor') navigate('/donor');
      else if (role === 'beneficiary') navigate('/beneficiary');
      else if (role === 'admin') navigate('/admin');
    } catch (error) {
        console.log('Login Error:', error);
        console.log('Response:', error.response);
        console.log('Data:', error.response?.data);

        const message =
        error.response?.data?.message ||
          'Login failed. Please check your credentials.';

         toast.error(message);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white text-2xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MedShareNet</h1>
          <p className="text-gray-500 mt-1">Connecting donors with those in need</p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
               {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
            ) : 'Sign In'}
            </Button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </Card>

        {/* Demo credentials */}
        <Card className="mt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">DEMO CREDENTIALS</p>
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            <p>🟢 Donor: rahul@test.com / Test@123</p>
            <p>🔵 Beneficiary: priya@test.com / Test@123</p>
            <p>🔴 Admin: admin@test.com / Test@123</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;