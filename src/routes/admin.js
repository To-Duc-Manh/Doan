const express = require('express');
const router = express.Router();
const authMiddleware = require('../app/middlewares/authMiddlewares');
const connect = require('../config/db');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

const multer = require('multer');
const fsExtra = require('fs-extra');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Chỉ định thư mục đích, không sử dụng file.originalname
        callback(null, path.join(__dirname, '../public/imgUpload/'));
    },
    filename: (req, file, callback) => {
        // Giữ lại tên gốc của file
        callback(null, file.originalname);
    },

});

const upload = multer({ storage });

const adminController = require('../app/controllers/adminControllers/adminController');
const nhanvienController = require('../app/controllers/adminControllers/nhanvienController');
const khachhangController = require('../app/controllers/adminControllers/khachhangController');
const productController = require('../app/controllers/adminControllers/productController');
const danhmucController = require('../app/controllers/adminControllers/danhmucController');
const hoadonController = require('../app/controllers/adminControllers/hoadonController');
const baohanhController = require('../app/controllers/adminControllers/baohanhController');
const nhapkhoController = require('../app/controllers/adminControllers/nhapkhoController');

router.get('/', authMiddleware.loggedin, (req, res) => {
    res.render('admin/admin.ejs');
});

//nhanvien
router.get('/nhanvien', authMiddleware.loggedin, nhanvienController.index);
router.post('/add_nhanvien', authMiddleware.loggedin, nhanvienController.add_nhanvien);
router.get('/edit_nhanvien/:id', authMiddleware.loggedin, nhanvienController.edit_nhanvien);
router.post('/update_nhanvien/:id', authMiddleware.loggedin, nhanvienController.update_nhanvien);
router.get('/delete_nhanvien/:id', authMiddleware.loggedin, nhanvienController.delete_nhanvien);
router.get('/search_nhanvien', authMiddleware.loggedin, nhanvienController.search);
// router.post('/upload', authMiddleware.loggedin, nhanvienController.search);
//khach hang
router.get('/khachhang', authMiddleware.loggedin, khachhangController.index);
router.post('/add_Khachhang', authMiddleware.loggedin, khachhangController.add_Khachhang);
router.get('/edit_Khachhang/:id', authMiddleware.loggedin, khachhangController.edit_Khachhang);
router.post('/update_Khachhang/:id', authMiddleware.loggedin, khachhangController.update_Khachhang);
router.get('/delete_Khachhang/:id', authMiddleware.loggedin, khachhangController.delete_Khachhang);
router.get('/search_khachhang', authMiddleware.loggedin, khachhangController.search);
//product
router.get('/product', authMiddleware.loggedin, productController.product);
router.post('/add_product', upload.single("hinh_anh"), productController.add_product);
router.post('/update_product/:id', upload.single("hinh_anh2"), productController.update_product);
router.get('/search_product', authMiddleware.loggedin, productController.search_product);
router.get('/edit_product/:id', authMiddleware.loggedin, productController.edit_product);
//product_all
router.get('/product_all', authMiddleware.loggedin, productController.product_all);
router.post('/add_product_all', upload.single("hinh_anh3"), productController.add_product_all);
router.get('/search_product_all', authMiddleware.loggedin, productController.search_product_all);
router.get('/searchPrice_product_all', authMiddleware.loggedin, productController.searchPrice_product_all);
router.get('/edit_product_all/:id', authMiddleware.loggedin, productController.edit_product_all);
router.post('/update_product_all/:id', upload.single("hinh_anh4"), productController.update_product_all);
router.get('/delete_product_all/:id', authMiddleware.loggedin, productController.delete_product_all);
//danhmuc
router.get('/danhmuc', authMiddleware.loggedin, productController.danhmuc);
router.post('/add_danh_muc', authMiddleware.loggedin, productController.add_danh_muc);
router.get('/delete_danh_muc/:id', authMiddleware.loggedin, productController.delete_danh_muc);
router.get('/search_danh_muc', authMiddleware.loggedin, productController.search_danh_muc);

router.get('/mau_sac', authMiddleware.loggedin, productController.mau_sac);
router.post('/add_mau_sac', authMiddleware.loggedin, productController.add_mau_sac);
router.get('/delete_mau_sac/:id', authMiddleware.loggedin, productController.delete_mau_sac);
router.get('/search_mau_sac', authMiddleware.loggedin, productController.search_mau_sac);

router.get('/dung_luong', authMiddleware.loggedin, productController.dung_luong);
router.get('/delete_dung_luong/:id', authMiddleware.loggedin, productController.delete_dung_luong);
router.post('/add_dung_luong', authMiddleware.loggedin, productController.add_dung_luong);
router.get('/search_dung_luong', authMiddleware.loggedin, productController.search_dung_luong);
//danhmuc
router.get('/tinh', authMiddleware.loggedin, danhmucController.tinh);
router.post('/add_tinh', authMiddleware.loggedin, danhmucController.add_tinh);
router.get('/delete_tinh/:id', authMiddleware.loggedin, danhmucController.delete_tinh);
router.get('/search_tinh', authMiddleware.loggedin, danhmucController.search_tinh);

router.get('/huyen', authMiddleware.loggedin, danhmucController.huyen);
router.post('/add_huyen', authMiddleware.loggedin, danhmucController.add_huyen);
router.get('/delete_huyen/:id', authMiddleware.loggedin, danhmucController.delete_huyen);
router.get('/search_huyen', authMiddleware.loggedin, danhmucController.search_huyen);

router.get('/xa', authMiddleware.loggedin, danhmucController.xa);
router.post('/add_xa', authMiddleware.loggedin, danhmucController.add_xa);
router.get('/delete_xa/:id', authMiddleware.loggedin, danhmucController.delete_xa);

router.get('/nhacungcap', authMiddleware.loggedin, danhmucController.nhacungcap);
router.post('/add_nha_cung_cap', authMiddleware.loggedin, danhmucController.add_nha_cung_cap);

router.get('/hangsanxuat', authMiddleware.loggedin, danhmucController.hangsanxuat);
router.post('/add_hangsanxuat', authMiddleware.loggedin, danhmucController.add_hangsanxuat);
router.get('/delete_hangsanxuat/:id', authMiddleware.loggedin, danhmucController.delete_hangsanxuat);
router.get('/search_hangsanxuat', authMiddleware.loggedin, danhmucController.search_hangsanxuat);

//hoadon
router.get('/hoadon', authMiddleware.loggedin, hoadonController.index);
router.get('/chi_tiet_hoa_don/:id', authMiddleware.loggedin, hoadonController.chi_tiet_hoa_don);
router.get('/them_hoa_don', authMiddleware.loggedin, hoadonController.get_sp_don_mua_hang);
router.post('/chuyen_trang_thai', authMiddleware.loggedin, hoadonController.chuyen_trang_thai);
router.post('/hoan_thanh_gh/:id', upload.single("hinh_anh5"), hoadonController.hoan_thanh_gh);
router.post('/them_don_mua_hang_get', authMiddleware.loggedin, hoadonController.them_don_mua_hang_get);
router.get('/search_sp_hd', authMiddleware.loggedin, hoadonController.search_sp_hd);
router.get('/search_khach_hang_hd', authMiddleware.loggedin, hoadonController.search_khach_hang_hd);
router.get('/edit_hoa_don/:id', authMiddleware.loggedin, hoadonController.edit_hoa_don);
router.get('/xoa_hoa_don/:id', authMiddleware.loggedin, hoadonController.xoa_hoa_don);
router.get('/xuat-hoa-don/:id', authMiddleware.loggedin, hoadonController.xuatHoaDonPDF);


//bao_hanh
router.get('/baohanh', authMiddleware.loggedin, baohanhController.index);
router.post('/add_baohanh', authMiddleware.loggedin, baohanhController.add_baohanh);
router.get('/getChiTietSanPhamByDonHang?:id', authMiddleware.loggedin, baohanhController.getChiTietSanPhamByDonHang);
router.get('/edit_baohanh/:id', authMiddleware.loggedin, baohanhController.edit_baohanh);
router.post('/update_baohanh/:id', authMiddleware.loggedin, baohanhController.update_baohanh);
router.get('/chi_tiet_bao_hanh/:id', authMiddleware.loggedin, baohanhController.chi_tiet_bao_hanh);


//nhap_kho
router.get('/nhapkho', authMiddleware.loggedin, nhapkhoController.index);
router.get('/nhap_kho', authMiddleware.loggedin, nhapkhoController.nhap_kho);
router.post('/them_nhap_kho', authMiddleware.loggedin, nhapkhoController.them_nhap_kho);
router.get('/chi_tiet_nhap_kho/:id', authMiddleware.loggedin, nhapkhoController.chi_tiet_nhap_kho);





router.post('/uploadfile', multipartMiddleware, (req, res) => {
    try {
        fs.readFile(req.files.upload.path, (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Sử dụng path.join để xây dựng đường dẫn tuyệt đối
            const newPath = path.join(__dirname, '../public/imgUpload/', req.files.upload.name);

            fs.writeFile(newPath, data, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                let fileName = req.files.upload.name;
                let url = '/imgUpload/' + fileName;
                let msg = 'Upload successfully';
                let funcNum = req.query.CKEditorFuncNum;
                console.log({ url, msg, funcNum });

                // Trả về kết quả thành công cho CKEditor
                res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;