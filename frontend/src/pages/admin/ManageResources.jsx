import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await api.get('/admin/resources', { params });
      setResources(res.data.resources);
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchResources(); }, [filter]);

  const handleApprove = async (id) => {
    setActionLoading(id + 'approve');
    try {
      await api.put(`/admin/resources/${id}/approve`, { adminNote: 'Verified and approved.' });
      toast.success('Resource approved!');
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const note = window.prompt('Reason for rejection (optional):');
    if (note === null) return;
    setActionLoading(id + 'reject');
    try {
      await api.put(`/admin/resources/${id}/reject`, { adminNote: note || 'Does not meet requirements.' });
      toast.success('Resource rejected');
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/admin" className="text-sm text-primary-600 hover:underline">← Back to Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Manage Resources</h1>
        <p className="text-gray-500">Review and approve/reject donated resources</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected', 'claimed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition duration-200
              ${filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          <p className="text-sm text-gray-500 mb-4">{resources.length} resource(s)</p>
          {resources.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-400">No {filter} resources found</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {resources.map((r) => (
                <Card key={r._id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{r.title}</h3>
                        <Badge status={r.status} />
                      </div>
                      <p className="text-gray-500 text-sm mb-3">{r.description}</p>

                      {/* Images — click to expand */}
                      {r.images && r.images.length > 0 && (
                        <div className="flex gap-2 mb-3 overflow-x-auto">
                          {r.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`resource-${i}`}
                              onClick={() => setExpandedImage(img)}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-80 hover:scale-105 transition"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>📦 <strong>Category:</strong> {r.category}</span>
                        <span>✅ <strong>Condition:</strong> {r.condition}</span>
                        <span>🔢 <strong>Quantity:</strong> {r.quantity}</span>
                        <span>📍 <strong>Location:</strong> {r.location}</span>
                        <span>👤 <strong>Donor:</strong> {r.donor?.name} ({r.donor?.email})</span>
                        <span>📅 <strong>Date:</strong> {new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>

                      {r.adminNote && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600"><strong>Admin Note:</strong> {r.adminNote}</p>
                        </div>
                      )}
                    </div>

                    {r.status === 'pending' && (
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <Button
                          variant="success"
                          onClick={() => handleApprove(r._id)}
                          disabled={!!actionLoading}
                          className="text-sm"
                        >
                          {actionLoading === r._id + 'approve' ? '...' : 'Approve'}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleReject(r._id)}
                          disabled={!!actionLoading}
                          className="text-sm"
                        >
                          {actionLoading === r._id + 'reject' ? '...' : 'Reject'}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Full screen image viewer */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
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

export default ManageResources;