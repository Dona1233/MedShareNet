import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'all', 'wheelchair', 'crutches', 'oxygen cylinder',
  'hospital bed', 'medicines', 'surgical equipment',
  'diagnostic equipment', 'other'
];

const CONDITIONS = ['all', 'new', 'good', 'fair', 'poor'];

const BrowseResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [requestForm, setRequestForm] = useState({
    message: '',
    quantityRequested: 1,
    deliveryAddress: '',
    disclaimerAccepted: false,
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      if (condition !== 'all') params.condition = condition;
      const res = await api.get('/resources', { params });
      setResources(res.data.resources);
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchResources(); }, [category, condition]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.message || !requestForm.deliveryAddress) {
      toast.error('Please fill all fields');
      return;
    }
    if (!requestForm.disclaimerAccepted) {
      toast.error('You must accept the medical disclaimer to proceed');
      return;
    }
    setRequesting(selectedResource._id);
    try {
      await api.post('/requests', {
        resourceId: selectedResource._id,
        ...requestForm,
        quantityRequested: Number(requestForm.quantityRequested),
        disclaimerAccepted: true,
      });
      toast.success('Request submitted successfully!');
      setSelectedResource(null);
      setRequestForm({ message: '', quantityRequested: 1, deliveryAddress: '', disclaimerAccepted: false });
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setRequesting(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedResource(null);
    setRequestForm({ message: '', quantityRequested: 1, deliveryAddress: '', disclaimerAccepted: false });
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/beneficiary" className="text-sm text-primary-600 hover:underline">← Back to Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Browse Resources</h1>
        <p className="text-gray-500">Find and request medical resources available near you</p>
      </div>

      {/* Search & Filter */}
      <Card className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="flex-1">
            <Input
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-2">CATEGORY</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition duration-200
                  ${category === c
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">CONDITION</p>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition duration-200
                  ${condition === c
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? <Spinner /> : (
        <>
          <p className="text-sm text-gray-500 mb-4">{resources.length} resource(s) found</p>
          {resources.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-400 text-lg">No resources found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {resources.map((r) => (
                <Card key={r._id}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{r.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{r.category}</p>
                    </div>
                    <Badge status={r.condition} />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{r.description}</p>

                  {/* Images — click to expand */}
                  {r.images && r.images.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto">
                      {r.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${r.title}-${i}`}
                          onClick={() => setExpandedImage(img)}
                          className="w-28 h-28 object-cover rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    <span>🔢 Qty: <strong>{r.quantity}</strong></span>
                    <span>📍 <strong>{r.location}</strong></span>
                    <span>👤 Donor: <strong>{r.donor?.name}</strong>
                      {r.donor?.verifiedBadge && (
                        <span className="ml-1 text-blue-600">✅ Verified</span>
                      )}
                    </span>
                    {r.donor?.phone && <span>📞 <strong>{r.donor.phone}</strong></span>}
                  </div>
                  <Button className="w-full" onClick={() => setSelectedResource(r)}>
                    Request This Resource
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Request Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-md my-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Request Resource</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedResource.title}</p>

            {/* Images inside modal */}
            {selectedResource.images && selectedResource.images.length > 0 && (
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {selectedResource.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`modal-${i}`}
                    onClick={() => setExpandedImage(img)}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-80 transition"
                  />
                ))}
              </div>
            )}

            <form onSubmit={handleRequest} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Quantity Needed *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedResource.quantity}
                  value={requestForm.quantityRequested}
                  onChange={(e) => setRequestForm({ ...requestForm, quantityRequested: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <span className="text-xs text-gray-400">Available: {selectedResource.quantity}</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Reason for Request *</label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  placeholder="Explain why you need this resource..."
                  rows={3}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <Input
                label="Delivery Address *"
                name="deliveryAddress"
                value={requestForm.deliveryAddress}
                onChange={(e) => setRequestForm({ ...requestForm, deliveryAddress: e.target.value })}
                placeholder="Your full delivery address"
                required
              />

              {/* Disclaimer */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-semibold mb-2">⚠️ Medical Disclaimer</p>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  MedShareNet is a platform that facilitates the redistribution of donated medical equipment.
                  We do not inspect, certify, or guarantee the safety or fitness of any donated item.
                  By requesting this resource, you acknowledge that you use it entirely at your own risk.
                  MedShareNet and its administrators are not liable for any injury, harm, or damage
                  resulting from the use of donated equipment.
                </p>
                <div className="flex items-start gap-2 mt-3">
                  <input
                    type="checkbox"
                    id="disclaimer"
                    checked={requestForm.disclaimerAccepted}
                    onChange={(e) => setRequestForm({ ...requestForm, disclaimerAccepted: e.target.checked })}
                    className="mt-0.5 accent-primary-600"
                  />
                  <label htmlFor="disclaimer" className="text-xs text-yellow-800 font-medium cursor-pointer">
                    I have read and accept the above disclaimer. I understand that I assume all risks
                    associated with using this donated medical equipment.
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={!!requesting} className="flex-1">
                  {requesting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button variant="secondary" type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Full screen image viewer */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-3xl w-full">
            <img
              src={expandedImage}
              alt="expanded"
              className="w-full max-h-screen object-contain rounded-lg"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-2 right-2 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-100"
            >
              ✕
            </button>
            <p className="text-white text-center text-xs mt-2">Click anywhere to close</p>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default BrowseResources;