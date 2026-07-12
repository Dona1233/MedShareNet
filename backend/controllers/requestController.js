const Request = require('../models/Request');
const Resource = require('../models/Resource');

// @desc    Create a new request
// @route   POST /api/requests
// @access  Beneficiary only
const createRequest = async (req, res) => {
  try {
    const {
      resourceId,
      message,
      quantityRequested,
      deliveryAddress,
      disclaimerAccepted,
    } = req.body;

    if (!resourceId || !message || !quantityRequested || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      });
    }

    if (quantityRequested <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity requested must be greater than 0',
      });
    }

    if (!disclaimerAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the medical disclaimer to proceed',
      });
    }

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    if (resource.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Resource is not available for request',
      });
    }

    if (quantityRequested > resource.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${resource.quantity} unit(s) available`,
      });
    }

    const alreadyRequested = await Request.findOne({
      resource: resourceId,
      beneficiary: req.user._id,
      status: 'pending',
    });

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested this resource',
      });
    }

    const request = await Request.create({
      resource: resourceId,
      beneficiary: req.user._id,
      message,
      quantityRequested,
      deliveryAddress,
      disclaimerAccepted: true,
    });

    await request.populate('resource', 'title category condition');
    await request.populate('beneficiary', 'name email');

    res.status(201).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get my requests
// @route   GET /api/requests/my
// @access  Beneficiary only
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      beneficiary: req.user._id,
    })
      .populate({
        path: 'resource',
        select: 'title category condition location images donor',
        populate: {
          path: 'donor',
          select: 'name email phone',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('resource', 'title category condition location quantity')
      .populate('beneficiary', 'name email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (
      request.beneficiary._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Cancel a request
// @route   DELETE /api/requests/:id
// @access  Beneficiary only
const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (
      request.beneficiary.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request that is already ${request.status}`,
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all requests
// @route   GET /api/admin/requests
// @access  Admin only
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('resource', 'title category condition location')
      .populate('beneficiary', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Approve request
// @route   PUT /api/admin/requests/:id/approve
// @access  Admin only
const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('resource')
      .populate('beneficiary', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    if (request.quantityRequested > request.resource.quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough quantity. Only ${request.resource.quantity} unit(s) left`,
      });
    }

    request.status = 'approved';
    request.adminNote =
      req.body.adminNote || 'Approved by admin';

    await request.save();

    const newQuantity =
      request.resource.quantity - request.quantityRequested;

    if (newQuantity === 0) {
      await Resource.findByIdAndUpdate(
        request.resource._id,
        {
          quantity: 0,
          status: 'claimed',
        }
      );
    } else {
      await Resource.findByIdAndUpdate(
        request.resource._id,
        {
          quantity: newQuantity,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Reject request
// @route   PUT /api/admin/requests/:id/reject
// @access  Admin only
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('beneficiary', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    request.status = 'rejected';
    request.adminNote =
      req.body.adminNote || 'Rejected by admin';

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get request status
// @route   GET /api/requests/:id/status
// @access  Private
const getRequestStatus = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('resource', 'title category')
      .populate('beneficiary', 'name email')
      .select(
        'status adminNote quantityRequested deliveryAddress createdAt updatedAt beneficiary resource'
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    const isOwner =
      request.beneficiary._id.toString() ===
      req.user._id.toString();

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelRequest,
  getAllRequests,
  approveRequest,
  rejectRequest,
  getRequestStatus,
};