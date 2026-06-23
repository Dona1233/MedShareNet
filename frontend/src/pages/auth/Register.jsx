import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'beneficiary',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill all required fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      const res = await api.post('/auth/register', submitData);
      login(res.data.user, res.data.token);
      toast.success(`Welcome to MedShareNet, ${res.data.user.name}!`);
      const role = res.data.user.role;
      if (role === 'donor') navigate('/donor');
      else if (role === 'beneficiary') navigate('/beneficiary');
      else if (role === 'admin') navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name *"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            <Input
              label="Email Address *"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            {/* Role selector */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">I am a *</label>
              <div className="grid grid-cols-2 gap-2">
                {['donor', 'beneficiary'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition duration-200 capitalize
                      ${form.role === r
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
                      }`}
                  >
                    {r === 'donor' ? '🤝 Donor' : '🙏 Beneficiary'}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Password *"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
            />
            <Input
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
            />
            <Input
              label="Phone (optional)"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Your phone number"
            />
            <Input
              label="Address (optional)"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Your city / address"
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;