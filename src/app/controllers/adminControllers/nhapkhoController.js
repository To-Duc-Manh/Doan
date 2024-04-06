const connect = require('../../../config/db');
const moment = require('moment');
const helper = require('../../controllers/helper');
const con = require('../../../config/db');

class nhapkhoController {

    index(req, res) {
        let sql = 'select * from tbl_phieu_nhap_kho'

        connect.query(sql, (err, phieunhapkho) => {
            res.render('admin/nhap_kho/nhap_kho.ejs', {
                user: req.session.user,
                phieunhapkho: phieunhapkho
            });
        })

    }

    nhap_kho(req, res) {
        let sql = "SELECT * FROM tbl_nha_cung_cap;";
        connect.query(sql, (err, nhacungcap) => {
            res.render('admin/nhap_kho/add_nhap_kho.ejs', {
                nhacungcap: nhacungcap,
                user: req.session.user
            });
        })
    }

    them_nhap_kho(req, res) {
        const { nhacungcap_id, tong_tien, trang_thai, ghi_chu, san_pham } = req.body;
        const user = req.session.user.id;
        console.log(req.body)
        const phieunhapkhoQuery = `INSERT INTO tbl_phieu_nhap_kho (nhan_vien_tao_id, nha_cung_cap_id, tong_tien, ghi_chu, trang_thai, ngay_tao) VALUES (?, ?, ?, ?, ?, NOW())`;
        const phieunhapkhoValues = [user, nhacungcap_id, tong_tien, ghi_chu, trang_thai, 1];

        connect.query(phieunhapkhoQuery, phieunhapkhoValues, (error, results, fields) => {
            if (error) {
                console.error('Lỗi khi thêm phiếu nhập kho: ' + error);
                res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm phiếu nhập kho.' });
                return;
            }

            const phieunhapkhoId = results.insertId;

            if (san_pham && Array.isArray(san_pham)) {
                san_pham.forEach((sp, index) => {
                    const chiTietQuery = `INSERT INTO tbl_chi_tiet_phieu_nhap_kho (phieu_nhap_kho_id, san_pham_chi_tiet_id, so_luong, gia, ngay_tao) VALUES (?, ?, ?, ?, NOW())`;
                    const chiTietValues = [phieunhapkhoId, sp.id, sp.so_luong, sp.gia];

                    connect.query(chiTietQuery, chiTietValues, (error, results, fields) => {
                        if (error) {
                            console.error('Lỗi khi thêm chi tiết đơn hàng: ' + error);
                            // Nếu có lỗi, gửi phản hồi lỗi
                            if (index === san_pham.length - 1) {
                                res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm chi tiết đơn hàng.' });
                            }
                            return;
                        }

                        // Nếu không có lỗi và là lần cuối cùng trong vòng lặp, gửi phản hồi thành công
                        if (index === san_pham.length - 1) {
                            res.json({ message: 'Đặt đơn hàng thành công.' });
                        }
                    });
                });
            } else {
                // Nếu không có sản phẩm được chọn, gửi phản hồi thành công
                res.json({ message: 'Đặt đơn hàng thành công.' });
            }
        });
    }

    chi_tiet_nhap_kho(req, res) {
        let id = req.params.id;

        let sql_ = "SELECT * FROM tbl_phieu_nhap_kho WHERE id = ?";

        connect.query(sql_, [id], (err, phieu_nhap_kho) => {
            if (err) throw err;

            if (phieu_nhap_kho.length === 0) {
                console.log("Không tìm thấy đơn mua hàng với id là " + id);
                // Trả về trang lỗi hoặc thông báo phù hợp
                res.status(404).send("Không tìm thấy đơn mua hàng với id là " + id);
                return;
            }

            let sql = "SELECT * FROM tbl_chi_tiet_phieu_nhap_kho WHERE phieu_nhap_kho_id = ?";

            connect.query(sql, [id], (err, chi_tiet_nhap_kho) => {
                if (err) throw err;

                res.render('admin/nhap_kho/chi_tiet_nhap_kho.ejs', {
                    user: req.session.user,
                    phieu_nhap_kho: phieu_nhap_kho[0],
                    chi_tiet_nhap_kho: chi_tiet_nhap_kho,
                });
            });
        });
    }

}

module.exports = new nhapkhoController();