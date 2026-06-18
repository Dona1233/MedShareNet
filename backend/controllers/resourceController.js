const Resource = require('../models/Resource');

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Donor only
const createResource = async (req, res) => {
  try {
    const { title, description, category, condition, quantity, location, images } = req.body;

    if (!title || !description || !category || !condition || !quantity || !location) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const resource = await Resource.create({
      title,
      description,
      category,
      condition,
      quantity,
      location,
      images: images || [],
      donor: req.user._id,
    });

    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get my donated resources
// @route   GET /api/resources/my
// @access  Donor only
const getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Donor only (own resource)
const updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Make sure the donor owns this resource
    if (resource.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this resource' });
    }

    // Only allow update if still pending
    if (resource.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Cannot update a resource that is already ${resource.status}` });
    }

    const { title, description, category, condition, quantity, location, images } = req.body;

    resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { title, description, category, condition, quantity, location, images },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Donor only (own resource)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Make sure the donor owns this resource
    if (resource.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this resource' });
    }

    // Only allow delete if still pending
    if (resource.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Cannot delete a resource that is already ${resource.status}` });
    }

    await resource.deleteOne();

    res.status(200).json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// @desc    Get all approved resources (with search & filter)
// @route   GET /api/resources
// @access  Private (any logged in user)
const getAllResources = async (req, res) => {
  try {
    const { search, category, condition, location } = req.query;

    // Build query object
    let query = { status: 'approved' };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by condition
    if (condition) {
      query.condition = condition;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const resources = await Resource.find(query)
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Private (any logged in user)
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('donor', 'name email phone address');

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.status(200).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
// @desc    Get all resources (admin)
// @route   GET /api/admin/resources
// @access  Admin only
const getAllResourcesAdmin = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const resources = await Resource.find(query)
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Approve a resource
// @route   PUT /api/admin/resources/:id/approve
// @access  Admin only
const approveResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Resource is already ${resource.status}` });
    }

    resource.status = 'approved';
    resource.adminNote = req.body.adminNote || 'Approved by admin';
    await resource.save();

    res.status(200).json({ success: true, message: 'Resource approved successfully', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Reject a resource
// @route   PUT /api/admin/resources/:id/reject
// @access  Admin only
const rejectResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Resource is already ${resource.status}` });
    }

    resource.status = 'rejected';
    resource.adminNote = req.body.adminNote || 'Rejected by admin';
    await resource.save();

    res.status(200).json({ success: true, message: 'Resource rejected successfully', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
module.exports = {
  createResource,
  getMyResources,
  updateResource,
  deleteResource,
  getAllResources,
  getResourceById,
  getAllResourcesAdmin,
  approveResource,
  rejectResource,
};