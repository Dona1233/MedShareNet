import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/requests');
      let data = res.data.requests;
      if (filter !== 'all') {
        data = data.filter((r) => r.status === filter);
      }
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchRequests(); }, [filter]);

  const handleApprove = async (id) => {
    setActionLoading(id + 'approve');
    try {
      await api.put(`/admin/requests/${id}/approve`, { adminNote: 'Verified and approved for delivery.' });
      toast.success('Request approved!');
      fetchRequests();
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
      await api.put(`/admin/requests/${id}/reject`, { adminNote: note || 'Request does not meet requirements.' });
      toast.success('Request rejected');
      fetchRequests();
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
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Manage Requests</h1>
        <p className="text-gray-500">Review and approve/reject beneficiary requests</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
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
          <p className="text-sm text-gray-500 mb-4">{requests.length} request(s)</p>
          {requests.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-400">No {filter} requests found</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests.map((r) => (
                <Card key={r._id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {r.resource?.title}
                        </h3>
                        <Badge status={r.status} />
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span>👤 <strong>Beneficiary:</strong> {r.beneficiary?.name} ({r.beneficiary?.email})</span>
                        <span>📦 <strong>Category:</strong> {r.resource?.category}</span>
                        <span>🔢 <strong>Qty Requested:</strong> {r.quantityRequested}</span>
                        <span>📍 <strong>Delivery:</strong> {r.deliveryAddress}</span>
                        <span>📅 <strong>Date:</strong> {new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg mb-2">
                        <p className="text-sm text-gray-600">
                          <strong>Reason:</strong> {r.message}
                        </p>
                      </div>
                      {r.adminNote && (
                        <div className={`p-3 rounded-lg ${r.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}>
                          <p className="text-sm"><strong>Admin Note:</strong> {r.adminNote}</p>
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
    </Layout>
  );
};

export default ManageRequests;