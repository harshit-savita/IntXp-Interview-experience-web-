// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
  renderLogin, 
  handleLogin, 
  renderDashboard, 
  renderAddPost, 
  addPost, 
  renderEditPost, 
  updatePost, 
  deletePost, 
  registerUser, 
  logout 
} = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/auth');

// Admin Login Page
router.get('/admin', renderLogin);

// Handle Admin Login
router.post('/admin', handleLogin);

// Admin Dashboard
router.get('/dashboard', authMiddleware, renderDashboard);

// Add New Post Page
router.get('/add-post', authMiddleware, renderAddPost);

// Handle Add New Post
router.post('/add-post', authMiddleware, addPost);

// Edit Post Page
router.get('/edit-post/:id', authMiddleware, renderEditPost);

// Handle Update Post
router.put('/edit-post/:id', authMiddleware, updatePost);

// Handle Delete Post
router.delete('/delete-post/:id', authMiddleware, deletePost);

// Handle User Registration
router.post('/register', registerUser);

// Handle Logout
router.get('/logout', logout);

module.exports = router;
