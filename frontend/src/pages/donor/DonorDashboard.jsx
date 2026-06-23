import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, color }) => (
  <Card className={`border-l-4 ${color}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
  </Card>
);

const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/donor');
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
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Manage your medical resource donations</p>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <Link to="/donor/add-resource">
          <Button>+ Donate Resource</Button>
        </Link>
        <Link to="/donor/my-donations">
          <Button variant="outline">View My Donations</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Donations" value={stats?.totalDonations ?? 0} color="border-blue-500" />
        <StatCard label="Pending" value={stats?.pendingDonations ?? 0} color="border-yellow-500" />
        <StatCard label="Approved" value={stats?.approvedDonations ?? 0} color="border-green-500" />
        <StatCard label="Rejected" value={stats?.rejectedDonations ?? 0} color="border-red-500" />
        <StatCard label="Claimed" value={stats?.claimedDonations ?? 0} color="border-purple-500" />
      </div>

      {/* Recent donations */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Donations</h2>
          <Link to="/donor/my-donations" className="text-sm text-primary-600 hover:underline">
            View all
          </Link>
        </div>
        {stats?.recentDonations?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No donations yet</p>
            <Link to="/donor/add-resource">
              <Button>Donate your first resource</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Title</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Quantity</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentDonations?.map((r) => (
                  <tr key={r._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-800">{r.title}</td>
                    <td className="py-3 px-3 text-gray-600 capitalize">{r.category}</td>
                    <td className="py-3 px-3 text-gray-600">{r.quantity}</td>
                    <td className="py-3 px-3"><Badge status={r.status} /></td>
                    <td className="py-3 px-3 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default DonorDashboard;