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
    institutionName: '',
    institutionType: '',
  });
  const [certificateFile, setCertificateFile] = useState(null);
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
    if (form.role === 'institution' && !form.institutionName) {
      toast.error('Please enter your institution name');
      return;
    }
    if (form.role === 'institution' && !form.institutionType) {
      toast.error('Please select your institution type');
      return;
    }

    setLoading(true);
    try {
      // Upload certificate if institution
      let certificateUrl = '';
      if (form.role === 'institution' && certificateFile) {
        const formData = new FormData();
        formData.append('images', certificateFile);
        const uploadRes = await api.post('/upload', formData);
        certificateUrl = uploadRes.data.urls[0];
      }

      const { confirmPassword, ...submitData } = form;
      if (certificateUrl) submitData.registrationCertificate = certificateUrl;

      const res = await api.post('/auth/register', submitData);
      login(res.data.user, res.data.token);

      const role = res.data.user.role;

      if (role === 'institution') {
        toast.success(`Welcome to MedShareNet, ${res.data.user.name}!`);
        toast('Your institution account is pending admin verification. You can browse and request resources in the meantime.', {
          icon: '🏛️',
          duration: 5000,
        });
        // Delay navigate so toasts render before unmount
        setTimeout(() => navigate('/beneficiary'), 1500);
      } else {
        toast.success(`Welcome to MedShareNet, ${res.data.user.name}!`);
        if (role === 'donor') navigate('/donor');
        else if (role === 'beneficiary') navigate('/beneficiary');
        else if (role === 'admin') navigate('/admin');
      }
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
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'donor', label: '🤝 Donor', desc: 'I want to donate' },
                  { value: 'beneficiary', label: '🙏 Beneficiary', desc: 'I need resources' },
                  { value: 'institution', label: '🏛️ Institution', desc: 'NGO / Hospital' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`py-3 px-2 rounded-lg border text-sm font-medium transition duration-200 text-center
                      ${form.role === r.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
                      }`}
                  >
                    <div>{r.label}</div>
                    <div className={`text-xs mt-1 ${form.role === r.value ? 'text-primary-100' : 'text-gray-400'}`}>
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Institution fields */}
            {form.role === 'institution' && (
              <>
                <Input
                  label="Institution Name *"
                  name="institutionName"
                  value={form.institutionName}
                  onChange={handleChange}
                  placeholder="e.g. Kerala Cancer Society"
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Institution Type *</label>
                  <select
                    name="institutionType"
                    value={form.institutionType}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select type</option>
                    <option value="hospital">Hospital</option>
                    <option value="ngo">NGO</option>
                    <option value="clinic">Clinic</option>
                    <option value="charity">Charity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Registration Certificate (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600"
                  />
                  <span className="text-xs text-gray-400">
                    Upload your institution's registration certificate (image or PDF)
                  </span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    🏛️ Institution accounts require admin verification before receiving a verified badge.
                    You can still browse and request resources while pending verification.
                  </p>
                </div>
              </>
            )}

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
