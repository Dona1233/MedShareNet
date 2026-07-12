const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Register User
const register = async (req, res) => {
  try {
    // UPDATED: Destructured institution specific fields sent by Register.jsx
    const { 
      name, 
      email, 
      password, 
      role, 
      phone, 
      address, 
      institutionName, 
      institutionType, 
      registrationCertificate 
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    // UPDATED: Added institution fields to the User initialization map
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'beneficiary',
      phone,
      address,
      institutionName: role === 'institution' ? institutionName : undefined,
      institutionType: role === 'institution' ? institutionType : undefined,
      registrationCertificate: role === 'institution' ? registrationCertificate : undefined
    });

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        institutionName: user.institutionName,
        institutionType: user.institutionType,
        registrationCertificate: user.registrationCertificate,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        institutionName: user.institutionName,
        institutionType: user.institutionType,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Current User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('GETME ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify institution (admin only)
// @route   PUT /api/auth/verify-institution/:id
// @access  Admin only
const verifyInstitution = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role !== 'institution') {
      return res.status(400).json({ success: false, message: 'User is not an institution' });
    }
    user.isVerified = true;
    user.verifiedBadge = true;
    await user.save();
    res.status(200).json({ success: true, message: 'Institution verified successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getMe, verifyInstitution };