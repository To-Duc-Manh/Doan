const express = require('express');
const router = express.Router();
const authMiddleware = require('../app/middlewares/authMiddlewares');
const homeUserController = require('../app/controllers/userControllers/homeUserController');


router.get('/', homeUserController.index);
router.get('/chi_tiet_sp/:id', homeUserController.chi_tiet_sp);
router.get('/cart', authMiddleware.loggedinUser, homeUserController.cart);
router.get('/add_to_cart/:id', authMiddleware.loggedinUser, homeUserController.add_to_cart);
router.post('/updateQuantity', authMiddleware.loggedinUser, homeUserController.updateQuantity)
router.post('/dat_hang_cart_hd', authMiddleware.loggedinUser, homeUserController.dat_hang_cart_hd);
router.get('/delete_cart/:id', authMiddleware.loggedinUser, homeUserController.delete_cart);
router.get('/dat_hang/:id', authMiddleware.loggedinUser, homeUserController.dat_hang);
router.post('/dat_hang2', authMiddleware.loggedinUser, homeUserController.dat_hang2);
router.post('/dat_hang_cart', homeUserController.dat_hang_cart);


router.get('/order', authMiddleware.loggedinUser, homeUserController.order);
router.get('/order_huy/:id', authMiddleware.loggedinUser, homeUserController.order_huy);


router.get('/all_product', homeUserController.all_product);
router.get('/search_product_all_user', homeUserController.search_product_all_user);
router.get('/searchPrice_product_all_user', homeUserController.searchPrice_product_all_user);
module.exports = router;
