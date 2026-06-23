import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import api from '../../utils/api';

const StatCard = ({ label, value, color }) => (
  <Card className={`border-l-4 ${color}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard 🛡️</h1>
        <p className="text-gray-500 mt-1">Overview of MedShareNet platform</p>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <Link to="/admin/resources">
          <Button>Manage Resources</Button>
        </Link>
        <Link to="/admin/requests">
          <Button variant="outline">Manage Requests</Button>
        </Link>
      </div>

      {/* User stats */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Users</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Users" value={stats?.users?.total ?? 0} color="border-blue-500" />
        <StatCard label="Donors" value={stats?.users?.donors ?? 0} color="border-green-500" />
        <StatCard label="Beneficiaries" value={stats?.users?.beneficiaries ?? 0} color="border-purple-500" />
      </div>

      {/* Resource stats */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Resources</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total" value={stats?.resources?.total ?? 0} color="border-blue-500" />
        <StatCard label="Pending" value={stats?.resources?.pending ?? 0} color="border-yellow-500" />
        <StatCard label="Approved" value={stats?.resources?.approved ?? 0} color="border-green-500" />
        <StatCard label="Rejected" value={stats?.resources?.rejected ?? 0} color="border-red-500" />
        <StatCard label="Claimed" value={stats?.resources?.claimed ?? 0} color="border-purple-500" />
      </div>

      {/* Request stats */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Requests</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats?.requests?.total ?? 0} color="border-blue-500" />
        <StatCard label="Pending" value={stats?.requests?.pending ?? 0} color="border-yellow-500" />
        <StatCard label="Approved" value={stats?.requests?.approved ?? 0} color="border-green-500" />
        <StatCard label="Rejected" value={stats?.requests?.rejected ?? 0} color="border-red-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resources by category */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resources by Category</h2>
          {stats?.resourcesByCategory?.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats?.resourcesByCategory?.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{item._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${Math.min((item.count / (stats?.resources?.total || 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent resources */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Resources</h2>
            <Link to="/admin/resources" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          {stats?.recentResources?.length === 0 ? (
            <p className="text-gray-400 text-sm">No resources yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats?.recentResources?.map((r) => (
                <div key={r._id} className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{r.category} · {r.donor?.name}</p>
                  </div>
                  <Badge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent requests */}
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Requests</h2>
            <Link to="/admin/requests" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          {stats?.recentRequests?.length === 0 ? (
            <p className="text-gray-400 text-sm">No requests yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Resource</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Beneficiary</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Qty</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentRequests?.map((r) => (
                    <tr key={r._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-800">{r.resource?.title}</td>
                      <td className="py-3 px-3 text-gray-600">{r.beneficiary?.name}</td>
                      <td className="py-3 px-3 text-gray-600">{r.quantityRequested}</td>
                      <td className="py-3 px-3"><Badge status={r.status} /></td>
                      <td className="py-3 px-3 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;