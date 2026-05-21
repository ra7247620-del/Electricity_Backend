const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/dashboard', authMiddleware, adminMiddleware, AdminController.getDashboard);
router.get('/users', authMiddleware, adminMiddleware, AdminController.getAllUsers);
router.put('/users/:id/role', authMiddleware, adminMiddleware, AdminController.updateUserRole);
router.delete('/users/:id', authMiddleware, adminMiddleware, AdminController.deleteUser);

module.exports = router;
