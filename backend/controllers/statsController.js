const User = require('../models/User');
const Resource = require('../models/Resource');
const Request = require('../models/Request');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalBeneficiaries = await User.countDocuments({ role: 'beneficiary' });

    const totalResources = await Resource.countDocuments();
    const pendingResources = await Resource.countDocuments({ status: 'pending' });
    const approvedResources = await Resource.countDocuments({ status: 'approved' });
    const rejectedResources = await Resource.countDocuments({ status: 'rejected' });
    const claimedResources = await Resource.countDocuments({ status: 'claimed' });

    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const approvedRequests = await Request.countDocuments({ status: 'approved' });
    const rejectedRequests = await Request.countDocuments({ status: 'rejected' });

    // Resources by category
    const resourcesByCategory = await Resource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent activity - last 5 resources
    const recentResources = await Resource.find()
      .populate('donor', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category status createdAt');

    // Recent activity - last 5 requests
    const recentRequests = await Request.find()
      .populate('beneficiary', 'name email')
      .populate('resource', 'title category')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('status quantityRequested createdAt');

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          donors: totalDonors,
          beneficiaries: totalBeneficiaries,
        },
        resources: {
          total: totalResources,
          pending: pendingResources,
          approved: approvedResources,
          rejected: rejectedResources,
          claimed: claimedResources,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests,
        },
        resourcesByCategory,
        recentResources,
        recentRequests,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get donor dashboard stats
// @route   GET /api/stats/donor
// @access  Donor only
const getDonorStats = async (req, res) => {
  try {
    const totalDonations = await Resource.countDocuments({ donor: req.user._id });
    const pendingDonations = await Resource.countDocuments({ donor: req.user._id, status: 'pending' });
    const approvedDonations = await Resource.countDocuments({ donor: req.user._id, status: 'approved' });
    const rejectedDonations = await Resource.countDocuments({ donor: req.user._id, status: 'rejected' });
    const claimedDonations = await Resource.countDocuments({ donor: req.user._id, status: 'claimed' });

    // Recent donations
    const recentDonations = await Resource.find({ donor: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category status createdAt quantity');

    res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        pendingDonations,
        approvedDonations,
        rejectedDonations,
        claimedDonations,
        recentDonations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get beneficiary dashboard stats
// @route   GET /api/stats/beneficiary
// @access  Beneficiary only
const getBeneficiaryStats = async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments({ beneficiary: req.user._id });
    const pendingRequests = await Request.countDocuments({ beneficiary: req.user._id, status: 'pending' });
    const approvedRequests = await Request.countDocuments({ beneficiary: req.user._id, status: 'approved' });
    const rejectedRequests = await Request.countDocuments({ beneficiary: req.user._id, status: 'rejected' });

    // Recent requests
    const recentRequests = await Request.find({ beneficiary: req.user._id })
      .populate('resource', 'title category')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('status quantityRequested createdAt adminNote');

    res.status(200).json({
      success: true,
      stats: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        recentRequests,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getAdminStats, getDonorStats, getBeneficiaryStats };