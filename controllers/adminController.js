// controllers/adminController.js
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Layout configuration
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

// Render Admin Login Page
const renderLogin = async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        };
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle Admin Login
const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.render('admin/index', { errorMessage: 'Invalid credentials', layout: adminLayout });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('admin/index', { errorMessage: 'Invalid credentials', layout: adminLayout });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' }); // Optional: set token expiry
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render Dashboard
const renderDashboard = async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        };
        const data = await Post.find().sort({ createdAt: -1 }); // Optional: sort posts
        res.render('admin/dashboard', { locals, data,isDashboard: true, layout: adminLayout });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render Add Post Page
const renderAddPost = (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        };
        res.render('admin/add-post', { locals, layout: adminLayout });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle Add Post
const addPost = async (req, res) => {
    try {
        const { title, body } = req.body;

        const newPost = new Post({
            title,
            body,
            author: req.userId // Assuming you have an author field
        });

        await newPost.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render Edit Post Page
const renderEditPost = async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        };

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render('admin/edit-post', { locals, data: post, layout: adminLayout });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle Update Post
const updatePost = async (req, res) => {
    try {
        const { title, body } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).send('Post not found');
        }

        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle Delete Post
const deletePost = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).send('Post not found');
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle User Registration
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User Created', user: { id: user._id, username: user.username } });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'Username already in use' });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle Logout
const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};

module.exports = {
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
};
