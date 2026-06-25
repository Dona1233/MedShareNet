import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/my');
      setRequests(res.data.requests);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await api.delete(`/requests/${id}`);
      toast.success('Request cancelled successfully');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel request');
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/beneficiary" className="text-sm text-primary-600 hover:underline">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">My Requests</h1>
          <p className="text-gray-500">{requests.length} request(s) made</p>
        </div>
        <Link to="/beneficiary/browse">
          <Button>Browse Resources</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-400 text-lg mb-4">No requests yet</p>
          <Link to="/beneficiary/browse">
            <Button>Browse available resources</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((r) => (
            <Card key={r._id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{r.resource?.title}</h3>
                    <Badge status={r.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span>📦 <strong>Category:</strong> {r.resource?.category}</span>
                    <span>🔢 <strong>Qty Requested:</strong> {r.quantityRequested}</span>
                    <span>📍 <strong>Delivery:</strong> {r.deliveryAddress}</span>
                    <span>📅 <strong>Date:</strong> {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg mb-3">
                    <p className="text-sm text-gray-600"><strong>Your message:</strong> {r.message}</p>
                  </div>

                  {/* Admin note */}
                  {r.adminNote && (
                    <div className={`p-3 rounded-lg mb-3 ${r.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="text-sm"><strong>Admin Note:</strong> {r.adminNote}</p>
                    </div>
                  )}

                  {/* Donor contact info — shown only when approved */}
                  {r.status === 'approved' && (
                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-semibold text-green-800 mb-3">
                        ✅ Your request is approved! Contact the donor to arrange pickup/delivery:
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-green-700">
                        {r.resource?.location && (
                          <span>📍 <strong>Pickup Location:</strong> {r.resource.location}</span>
                        )}
                        {r.resource?.donor?.name && (
                          <span>👤 <strong>Donor:</strong> {r.resource.donor.name}</span>
                        )}
                        {r.resource?.donor?.phone && (
                          <span>📞 <strong>Phone:</strong> {r.resource.donor.phone}</span>
                        )}
                        {r.resource?.donor?.email && (
                          <span>📧 <strong>Email:</strong> {r.resource.donor.email}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rejected state */}
                  {r.status === 'rejected' && (
                    <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-800">
                        ❌ This request was rejected. You can browse other available resources.
                      </p>
                    </div>
                  )}
                </div>

                {r.status === 'pending' && (
                  <Button
                    variant="danger"
                    onClick={() => handleCancel(r._id)}
                    className="ml-4 text-sm flex-shrink-0"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyRequests;