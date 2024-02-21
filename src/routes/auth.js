const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/authController/loginController');

router.get('/loginAdmin', (req, res) => {
    res.render('auth/loginAdmin.ejs');
});
router.get('/loginUser', (req, res) => {
    res.render('auth/loginUser.ejs');
})
router.get('/register', (req, res) => {
    res.render('auth/registerUser.ejs');
});
router.post('/loginAdmin', authController.loginAdmin);
router.post('/loginUser', authController.loginUser);
router.get('/logoutAdmin', authController.logoutAdmin);
router.get('/logoutUser', authController.logoutUser);
router.post('/registeruser', authController.register);


module.exports = router;