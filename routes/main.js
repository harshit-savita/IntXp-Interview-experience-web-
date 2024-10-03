const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Home route
router.get('/', postController.getHomePage);

// Get single post by ID
router.get('/post/:id', postController.getPostById);

// Search posts
router.post('/search', postController.searchPosts);

// About page
router.get('/about', postController.getAboutPage);

module.exports = router;
