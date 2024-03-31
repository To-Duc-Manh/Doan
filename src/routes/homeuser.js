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
router.post('/dat_hang_cart', authMiddleware.loggedinUser, homeUserController.dat_hang_cart);


router.get('/order', authMiddleware.loggedinUser, homeUserController.order);
router.get('/order_huy/:id', authMiddleware.loggedinUser, homeUserController.order_huy);
router.get('/da_nhan_hang/:id', authMiddleware.loggedinUser, homeUserController.da_nhan_hang);

router.get('/all_product', authMiddleware.loggedinUser, homeUserController.all_product);
router.get('/search_product_all_user', homeUserController.search_product_all_user);
router.get('/searchPrice_product_all_user', homeUserController.searchPrice_product_all_user);

router.get('/lich_su_mua_hang', authMiddleware.loggedinUser, homeUserController.lich_su_mua_hang);
router.get('/mua_lai_hang/:id', authMiddleware.loggedinUser, homeUserController.select_mua_lai_hang);
router.post('/updateQuantity_mua_lai', authMiddleware.loggedinUser, homeUserController.updateQuantity_mua_lai)
router.post('/placeOrder/:id', authMiddleware.loggedinUser, homeUserController.xac_nhan_mua_lai_hang);


router.get('/tai_khoan', authMiddleware.loggedinUser, homeUserController.tai_khoan);
router.get('/getHuyenByHuyen/:id', homeUserController.getHuyenByHuyen);
router.get('/getXaByXa/:id', homeUserController.getXaByXa);
router.post('/update_user', authMiddleware.loggedinUser, homeUserController.update_user);
router.post('/doi_mk', authMiddleware.loggedinUser, homeUserController.doi_mk)


//bao_hanh
router.get('/bao_hanh', authMiddleware.loggedinUser, homeUserController.bao_hanh);
router.post('/luu_phieu_bao_hanh', authMiddleware.loggedinUser, homeUserController.luu_phieu_bao_hanh);

module.exports = router;
