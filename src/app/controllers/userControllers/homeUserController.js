const connect = require('../../../config/db');
const moment = require('moment');


class homeUserController {

    index(req, res) {
        let sql = "CALL GetProductDetails();";
        //let sql = "SELECT tbl_san_pham.ten_san_pham, tbl_danh_muc.ten_danh_muc, tbl_nha_san_xuat.ten_nha_san_xuat, tbl_mau_sac.ten_mau_sac, tbl_dung_luong.ten_dung_luong, tbl_chi_tiet_san_pham.gia_ban, tbl_chi_tiet_san_pham.serial, tbl_chi_tiet_san_pham.ngay_tao, tbl_chi_tiet_san_pham.ngay_cap_nhat FROM tbl_san_pham JOIN tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id JOIN tbl_chi_tiet_san_pham ON tbl_san_pham.id = tbl_chi_tiet_san_pham.san_pham_id JOIN tbl_mau_sac ON tbl_chi_tiet_san_pham.mau_sac_id = tbl_mau_sac.id JOIN tbl_dung_luong ON tbl_chi_tiet_san_pham.dung_luong_id = tbl_dung_luong.id;";
        //let sql = "SELECT tbl_san_pham.ten_san_pham, tbl_danh_muc.ten_danh_muc, tbl_nha_san_xuat.ten_nha_san_xuat, tbl_mau_sac.ten_mau_sac, tbl_dung_luong.ten_dung_luong, max_ctsp.gia_ban, max_ctsp.serial, max_ctsp.ngay_tao, max_ctsp.ngay_cap_nhat FROM tbl_san_pham JOIN tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id JOIN ( SELECT san_pham_id, MAX(id) AS max_id FROM tbl_chi_tiet_san_pham GROUP BY san_pham_id ) AS max_ids ON tbl_san_pham.id = max_ids.san_pham_id JOIN tbl_chi_tiet_san_pham max_ctsp ON max_ids.max_id = max_ctsp.id JOIN tbl_mau_sac ON max_ctsp.mau_sac_id = tbl_mau_sac.id JOIN tbl_dung_luong ON max_ctsp.dung_luong_id = tbl_dung_luong.id;";
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

        // Gọi stored procedure GetProductDetailsAndRelated với tham số là id
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
        // Lấy id của khách hàng từ session
        let khach_hang_id = req.session.user.id;

        // Truy vấn để lấy dữ liệu từ bảng tbl_gio_hang cho khách hàng hiện tại
        const query = `SELECT 
        sp.ten_san_pham AS ten_san_pham,
        sp.hinh_anh AS hinh_anh_san_pham,
        ms.ten_mau_sac AS mau_sac,
        dl.ten_dung_luong AS dung_luong,
        cts.gia_ban,
        cts.id,
        gh.so_luong
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
            // Render view và truyền dữ liệu giỏ hàng vào đó
            res.render('user/cart.ejs', {
                user: req.session.user,
                cartItems: results
            });
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

        // Thực hiện chèn dữ liệu vào bảng "tbl_don_mua_hang"
        const donHangQuery = `INSERT INTO tbl_don_mua_hang (ten_nguoi_mua, so_dien_thoai, dia_chi_mua_hang, ghi_chu, tong_tien, tong_tien_thanh_toan, hinh_thuc_thanh_toan, trang_thai, ngay_tao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const donHangValues = [hoTen, soDienThoai, diaChi, ghiChu, tongGia, 0, hinhThucThanhToan, 1];

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
}



module.exports = new homeUserController(); 