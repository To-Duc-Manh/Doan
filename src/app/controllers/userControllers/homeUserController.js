const connect = require('../../../config/db');
const moment = require('moment');

const helper = require('../../controllers/helper');

class homeUserController {

    index(req, res) {
        let sql = "CALL GetProductDetails();";
        connect.query(sql, (err, data) => {
            res.render('user/home.ejs', {
                data: data[0],
                user: req.session.user
            });
            console.log(data);

        });
    }

    chi_tiet_sp(req, res) {
        let id = req.params.id;
        let sql = "CALL GetProductDetailsAndRelated(?)";

        connect.query(sql, [id], (err, results) => {
            if (err) throw err;

            // Kết quả trả về từ stored procedure
            let productDetail = results[0][0]; // Lấy thông tin chi tiết sản phẩm cụ thể
            let relatedDetails = results[1];   // Lấy danh sách chi tiết sản phẩm khác có cùng sản phẩm ID

            res.render('user/chi_tiet_sp.ejs', {
                user: req.session.user,
                productDetail: productDetail,
                relatedDetails: relatedDetails
            });
            console.log('p', productDetail);
            console.log(relatedDetails);
        });
        console.log('id', id);
    }

    cart(req, res) {

        let khach_hang_id = req.session.user.id;

        const query = `SELECT 
        sp.ten_san_pham AS ten_san_pham,
        ms.ten_mau_sac AS mau_sac,
        dl.ten_dung_luong AS dung_luong,
        cts.hinh_anh AS hinh_anh,
        cts.gia_ban,
        gh.so_luong,
        gh.id
    FROM 
        tbl_gio_hang gh
    JOIN 
        tbl_chi_tiet_san_pham cts ON gh.chi_tiet_san_pham_id = cts.id
    JOIN 
        tbl_san_pham sp ON cts.san_pham_id = sp.id
    JOIN 
        tbl_mau_sac ms ON cts.mau_sac_id = ms.id
    JOIN 
        tbl_dung_luong dl ON cts.dung_luong_id = dl.id
    WHERE 
        gh.khach_hang_id = ?;
    `;
        connect.query(query, [khach_hang_id], (err, results) => {
            if (err) {
                console.error('Error retrieving cart items: ' + err.message);
                res.status(500).json({ error: 'Error retrieving cart items' });
                return;
            }
            res.render('user/cart.ejs', {
                user: req.session.user,
                cartItems: results
            });
            console.log(results)
        });
    }

    add_to_cart(req, res) {
        let chi_tiet_san_pham_id = req.params.id;
        let khach_hang_id = req.session.user.id;

        // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
        const selectQuery = `SELECT * FROM tbl_gio_hang WHERE khach_hang_id = ? AND chi_tiet_san_pham_id = ?`;
        connect.query(selectQuery, [khach_hang_id, chi_tiet_san_pham_id], (err, results) => {
            if (err) {
                console.error('Error checking item in cart: ' + err.message);
                res.status(500).json({ error: 'Error checking item in cart' });
                return;
            }

            if (results.length > 0) {
                // Nếu sản phẩm đã tồn tại, thực hiện truy vấn UPDATE để tăng số lượng lên 1
                const updateQuery = `UPDATE tbl_gio_hang SET so_luong = so_luong + 1, ngay_cap_nhat = NOW() WHERE khach_hang_id = ? AND chi_tiet_san_pham_id = ?`;
                connect.query(updateQuery, [khach_hang_id, chi_tiet_san_pham_id], (err, results) => {
                    if (err) {
                        console.error('Error updating item in cart: ' + err.message);
                        res.status(500).json({ error: 'Error updating item in cart' });
                        return;
                    }
                    console.log('Item quantity updated in cart successfully');
                    res.redirect('/cart');
                });
            } else {
                // Nếu sản phẩm chưa tồn tại, thực hiện truy vấn INSERT để thêm mục mới vào giỏ hàng
                const insertQuery = `INSERT INTO tbl_gio_hang (khach_hang_id, chi_tiet_san_pham_id, so_luong, ngay_tao) VALUES (?, ?, ?, NOW())`;
                connect.query(insertQuery, [khach_hang_id, chi_tiet_san_pham_id, 1], (err, results) => {
                    if (err) {
                        console.error('Error adding item to cart: ' + err.message);
                        res.status(500).json({ error: 'Error adding item to cart' });
                        return;
                    }
                    console.log('Item added to cart successfully');
                    res.redirect('/cart');
                });
            }
        });
    }

    delete_cart(req, res) {
        const tableName = 'tbl_gio_hang';
        const tableId = 'id';
        const redirectPath = 'cart';
        helper.deleteRecord_user(tableName, tableId, redirectPath, req, res);
    }
    updateQuantity(req, res) {
        const { itemId, newQuantity } = req.body;
        const sql = 'UPDATE tbl_gio_hang SET so_luong = ? WHERE id = ?';

        connect.query(sql, [newQuantity, itemId], (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).send('Update successful');
            }
        });
    }

    dat_hang(req, res) {
        let id = req.params.id;

        // Gọi stored procedure GetProductDetails với tham số là id
        let sql = "CALL GetProduct_datHang(?)";
        let so_luong = 0;
        connect.query(sql, [id], (err, results) => {
            if (err) throw err;

            // Kết quả trả về từ stored procedure
            let product_datHang = results[0][0]; // Lấy thông tin chi tiết sản phẩm cụ thể

            res.render('user/dat_hang.ejs', {
                user: req.session.user,
                product_datHang: product_datHang,
                so_luong: so_luong + 1
            });
            console.log('p', product_datHang);
        });
        console.log('id', id);
    }

    dat_hang2(req, res) {
        const { hoTen, soDienThoai, diaChi, ghiChu, hinhThucThanhToan, soLuong, giaBan, tongGia, tong_tien_thanh_toan, san_pham_id } = req.body;
        const userId = req.session.user.id;
        // Thực hiện chèn dữ liệu vào bảng "tbl_don_mua_hang"
        const donHangQuery = `INSERT INTO tbl_don_mua_hang (khach_hang_id, ten_nguoi_mua, so_dien_thoai, dia_chi_mua_hang, ghi_chu, tong_tien, tong_tien_thanh_toan, hinh_thuc_thanh_toan, trang_thai, ngay_tao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const donHangValues = [userId, hoTen, soDienThoai, diaChi, ghiChu, tongGia, 0, hinhThucThanhToan, 1];

        connect.query(donHangQuery, donHangValues, (error, results, fields) => {
            if (error) {
                console.error('Lỗi khi thêm đơn hàng: ' + error);
                res.status(500).json({ message: 'Đã xảy ra lỗi khi đặt hàng.' });
                return;
            }

            const donMuaHangId = results.insertId;

            // Thực hiện chèn dữ liệu vào bảng "tbl_chi_tiet_don_mua_hang"
            const chiTietQuery = `INSERT INTO tbl_chi_tiet_don_mua_hang (don_mua_hang_id, chi_tiet_san_pham_id, so_luong, gia, ngay_tao) VALUES (?, ?, ?, ?, NOW())`;
            const chiTietValues = [donMuaHangId, san_pham_id, soLuong, giaBan];

            connect.query(chiTietQuery, chiTietValues, (error, results, fields) => {
                if (error) {
                    console.error('Lỗi khi thêm chi tiết đơn hàng: ' + error);
                    res.status(500).json({ message: 'Đã xảy ra lỗi khi đặt hàng.' });
                    return;
                }

                res.json({ message: 'Đặt hàng thành công.' });
            });
        });

    }
    dat_hang_cart(req, res) {
        let selectedProducts = req.body.selectedProducts;
        let selectedProductIds = selectedProducts.split(',').map(Number);

        let sql = "CALL GetProducts2_datHang(?)";

        connect.query(sql, [selectedProductIds.join(',')], (err, results) => {
            if (err) throw err;

            let products_datHang = results[0];

            console.log(products_datHang);
            res.render('user/dat_hang_cart.ejs', {
                user: req.session.user,
                products_datHang: products_datHang,

            });
        });
        console.log('selectedProductIds', selectedProductIds);
    }

    dat_hang_cart_hd(req, res) {
        const { hoTen, soDienThoai, diaChi, ghiChu, hinhThucThanhToan, tong_tien_thanh_toan, sanPhamArray } = req.body;
        const userId = req.session.user.id;

        // Thực hiện chèn dữ liệu vào bảng "tbl_don_mua_hang"
        const donHangQuery = `
            INSERT INTO tbl_don_mua_hang 
            (khach_hang_id, ten_nguoi_mua, so_dien_thoai, dia_chi_mua_hang, ghi_chu, tong_tien, tong_tien_thanh_toan, hinh_thuc_thanh_toan, trang_thai, ngay_tao) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const donHangValues = [userId, hoTen, soDienThoai, diaChi, ghiChu, 0, tong_tien_thanh_toan, hinhThucThanhToan, 1];

        connect.query(donHangQuery, donHangValues, (error, results, fields) => {
            if (error) {
                console.error('Lỗi khi thêm đơn hàng: ' + error);
                res.status(500).json({ message: 'Đã xảy ra lỗi khi đặt hàng.' });
                return;
            }

            const donMuaHangId = results.insertId;

            // Duyệt qua mảng sản phẩm và thêm từng sản phẩm vào bảng "tbl_chi_tiet_don_mua_hang"
            sanPhamArray.forEach((sanPham) => {
                const { chiTietId, soLuong, giaBan } = sanPham;
                const chiTietQuery = `
                    INSERT INTO tbl_chi_tiet_don_mua_hang 
                    (don_mua_hang_id, chi_tiet_san_pham_id, so_luong, gia, ngay_tao) 
                    VALUES (?, ?, ?, ?, NOW())`;
                const chiTietValues = [donMuaHangId, chiTietId, soLuong, giaBan];

                connect.query(chiTietQuery, chiTietValues, (error, results, fields) => {
                    if (error) {
                        console.error('Lỗi khi thêm chi tiết đơn hàng: ' + error);
                        res.status(500).json({ message: 'Đã xảy ra lỗi khi đặt hàng.' });
                        return;
                    }
                });

                const xoaSanPhamQuery = `DELETE FROM tbl_gio_hang WHERE chi_tiet_san_pham_id = ? AND khach_hang_id = ?`;
                const xoaSanPhamValues = [chiTietId, userId];
                connect.query(xoaSanPhamQuery, xoaSanPhamValues, (error, results, fields) => {
                    if (error) {
                        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng: ' + error);
                        return;
                    }
                });
            });

            res.json({ message: 'Đặt hàng thành công.' });
        });
    }


    order(req, res) {
        let sql_hd = 'SELECT * FROM tbl_don_mua_hang';
        connect.query(sql_hd, (err, don_mua_hang) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            let sql = `SELECT 
        tbl_chi_tiet_don_mua_hang.so_luong AS so_luong,
        tbl_chi_tiet_don_mua_hang.don_mua_hang_id AS don_mua_hang_id,
        tbl_chi_tiet_san_pham.hinh_anh AS hinh_anh,
        tbl_san_pham.ten_san_pham AS ten_san_pham,
        tbl_dung_luong.ten_dung_luong AS dung_luong,
        tbl_mau_sac.ten_mau_sac AS mau_sac,
        tbl_chi_tiet_san_pham.gia_ban AS gia_ban,
        tbl_don_mua_hang.tong_tien AS tong_tien,
        tbl_don_mua_hang.trang_thai AS trang_thai,
        tbl_don_mua_hang.khach_hang_id AS khach_hang_id
    FROM 
        tbl_chi_tiet_don_mua_hang
    JOIN tbl_don_mua_hang ON tbl_chi_tiet_don_mua_hang.don_mua_hang_id = tbl_don_mua_hang.id
    JOIN tbl_chi_tiet_san_pham ON tbl_chi_tiet_don_mua_hang.chi_tiet_san_pham_id = tbl_chi_tiet_san_pham.id
    JOIN tbl_san_pham ON tbl_chi_tiet_san_pham.san_pham_id = tbl_san_pham.id
    JOIN tbl_mau_sac ON tbl_chi_tiet_san_pham.mau_sac_id = tbl_mau_sac.id
    JOIN tbl_dung_luong ON tbl_chi_tiet_san_pham.dung_luong_id = tbl_dung_luong.id;
    `;

            connect.query(sql, (err, data) => {
                res.render('user/order.ejs', {
                    data: data,
                    don_mua_hang: don_mua_hang,
                    user: req.session.user
                });
                console.log(data);

            });
        });

    }


    all_product(req, res) {
        let sql = 'SELECT * FROM tbl_chi_tiet_san_pham';
        connect.query(sql, (err, data) => {
            res.render('user/all_product.ejs', {
                data: data,
                user: req.session.user
            });
        });

    }
}



module.exports = new homeUserController(); 