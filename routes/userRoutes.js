const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// protect middleware will be used for all next routes
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router
    .route('/')
    .get(
        authController.restrictTo('manager', 'admin'),
        userController.getAllUsers
    )
    .post(
        authController.restrictTo('manager', 'admin'),
        userController.createUser
    );

router
    .route('/:id')
    .get(authController.restrictTo('manager', 'admin'), userController.getUser)
    .patch(
        authController.restrictTo('manager', 'admin'),
        userController.updateUser
    )
    .delete(authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
