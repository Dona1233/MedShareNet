import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const MyDonations = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources/my');
      setResources(res.data.resources);
    } catch (error) {
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      await api.delete(`/resources/${id}`);
      toast.success('Donation deleted successfully');
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/donor" className="text-sm text-primary-600 hover:underline">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">My Donations</h1>
          <p className="text-gray-500">{resources.length} resource(s) donated</p>
        </div>
        <Link to="/donor/add-resource">
          <Button>+ Add New</Button>
        </Link>
      </div>

      {resources.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">You haven't donated any resources yet</p>
          <Link to="/donor/add-resource">
            <Button>Donate your first resource</Button>
          </Link>
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
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📦 <strong>Category:</strong> {r.category}</span>
                    <span>✅ <strong>Condition:</strong> {r.condition}</span>
                    <span>🔢 <strong>Quantity:</strong> {r.quantity}</span>
                    <span>📍 <strong>Location:</strong> {r.location}</span>
                    <span>📅 <strong>Date:</strong> {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.adminNote && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600"><strong>Admin Note:</strong> {r.adminNote}</p>
                    </div>
                  )}
                </div>
                {r.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(r._id)}
                      className="text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyDonations;