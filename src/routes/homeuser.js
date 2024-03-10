const express = require('express');
const router = express.Router();
const authMiddleware = require('../app/middlewares/authMiddlewares');
const homeUserController = require('../app/controllers/userControllers/homeUserController');


router.get('/', homeUserController.index);
router.get('/chi_tiet_sp/:id', homeUserController.chi_tiet_sp);
router.get('/cart', authMiddleware.loggedinUser, homeUserController.cart);
router.get('/add_to_cart/:id', authMiddleware.loggedinUser, homeUserController.add_to_cart);
router.get('/dat_hang/:id', authMiddleware.loggedinUser, homeUserController.dat_hang);
router.post('/dat_hang2', authMiddleware.loggedinUser, homeUserController.dat_hang2);
router.post('/submit_selected_products', homeUserController.submit_selected_products);
router.get('/order', authMiddleware.loggedinUser, homeUserController.order);
module.exports = router;
