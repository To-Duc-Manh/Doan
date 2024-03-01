const express = require('express');
const router = express.Router();
const authMiddleware = require('../app/middlewares/authMiddlewares');
const homeUserController = require('../app/controllers/userControllers/homeUserController');


router.get('/', homeUserController.index);
router.get('/chi_tiet_sp/:id', homeUserController.chi_tiet_sp);
router.get('/cart', homeUserController.cart);
router.get('/add_to_cart/:id', homeUserController.add_to_cart);
router.get('/dat_hang/:id', homeUserController.dat_hang);
router.post('/dat_hang2', homeUserController.dat_hang2);
module.exports = router;
