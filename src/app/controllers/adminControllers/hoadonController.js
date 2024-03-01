const connect = require('../../../config/db');
const moment = require('moment');

const helper = require('../../controllers/helper');

class hoadonController {
    index(req, res) {
        let sql = " select * from tbl_don_mua_hang ";
        connect.query(sql, (err, data) => {
            res.render('admin/hoa_don/hoa_don.ejs', {
                data: data,
                user: req.session.user
            });
        })

    }

    chi_tiet_hoa_don(req, res) {
        let id = req.params.id;

        // Gọi stored procedure GetProductDetails với tham số là id
        let sql = "select * from tbl_chi_tiet_don_mua_hang where don_mua_hang_id = ?";

        connect.query(sql, [id], (err, chi_tiet_hoa_don) => {
            if (err) throw err;

            // Kết quả trả về từ stored procedure
            // Lấy thông tin chi tiết sản phẩm cụ thể

            res.render('admin/hoa_don/chi_tiet_hd.ejs', {
                user: req.session.user,
                chi_tiet_hoa_don: chi_tiet_hoa_don,

            });

        });
    }
}

module.exports = new hoadonController(); 
