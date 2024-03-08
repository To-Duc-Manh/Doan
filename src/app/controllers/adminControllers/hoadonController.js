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
    
        let sql_ = "SELECT * FROM tbl_don_mua_hang WHERE id = ?";
    
        connect.query(sql_, [id], (err, don_mua_hang) => {
            if (err) throw err;
    
            if (don_mua_hang.length === 0) {
                // Xử lý trường hợp không có dữ liệu
                console.log("Không tìm thấy đơn mua hàng với id là " + id);
                // Trả về trang lỗi hoặc thông báo phù hợp
                res.status(404).send("Không tìm thấy đơn mua hàng với id là " + id);
                return;
            }
    
            let sql = "SELECT * FROM tbl_chi_tiet_don_mua_hang WHERE don_mua_hang_id = ?";
    
            connect.query(sql, [id], (err, chi_tiet_hoa_don) => {
                if (err) throw err;
    
                res.render('admin/hoa_don/chi_tiet_hd.ejs', {
                    user: req.session.user,
                    don_mua_hang: don_mua_hang[0], // Truyền phần tử đầu tiên của mảng
                    chi_tiet_hoa_don: chi_tiet_hoa_don,
                });
            });
        });
    }
    
}

module.exports = new hoadonController(); 
