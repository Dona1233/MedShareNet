import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'wheelchair', 'crutches', 'oxygen cylinder',
  'hospital bed', 'medicines', 'surgical equipment',
  'diagnostic equipment', 'other'
];

const CONDITIONS = ['new', 'good', 'fair', 'poor'];

const AddResource = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    quantity: '',
    location: '',
  });

  // Image states
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  //const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.condition ||
      !form.quantity ||
      !form.location
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Upload images first (if any)
      let imageUrls = [];

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append('images', file));

        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrls = uploadRes.data.urls;
        setUploadedUrls(imageUrls);
      }

      await api.post('/resources', {
        ...form,
        quantity: Number(form.quantity),
        images: imageUrls,
      });

      toast.success('Resource donated successfully! Pending admin approval.');
      navigate('/donor/my-donations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/donor" className="text-sm text-primary-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Donate a Resource
        </h1>
        <p className="text-gray-500">
          Fill in the details of the medical resource you want to donate
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Resource Title *"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Foldable Wheelchair"
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the condition, usage history, any relevant details..."
                rows={4}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Condition *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setForm({ ...form, condition: c })
                    }
                    className={`py-2 rounded-lg border text-sm font-medium capitalize transition duration-200
                      ${
                        form.condition === c
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity *"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 1"
                required
              />
              <Input
                label="Location *"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Kochi, Kerala"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Photos (up to 3) — highly recommended
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files).slice(0, 3);
                  setImageFiles(files);
                  setImagePreviews(
                    files.map((f) => URL.createObjectURL(f))
                  );
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />

              <span className="text-xs text-gray-400">
                Upload clear photos showing the actual condition of the item
              </span>

              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imagePreviews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`preview-${i}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Donation'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate('/donor')}
                type="button"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddResource;