const connect = require('../../../config/db');
const moment = require('moment');
const helper = require('../../controllers/helper');

class baohanhController {

    index(req, res) {
        let sql = `
        SELECT 
        pbh.*, 
        sp.ten_san_pham, 
        ctsan.hinh_anh AS hinh_anh_chi_tiet, 
        ms.ten_mau_sac, 
        dl.ten_dung_luong,
        nv.ten_nhan_vien
    FROM tbl_phieu_bao_hanh AS pbh
    LEFT JOIN tbl_chi_tiet_don_mua_hang AS ctdmh ON pbh.chi_tiet_don_mua_hang_id = ctdmh.id
    LEFT JOIN tbl_chi_tiet_san_pham AS ctsan ON ctdmh.chi_tiet_san_pham_id = ctsan.id
    LEFT JOIN tbl_san_pham AS sp ON ctsan.san_pham_id = sp.id
    LEFT JOIN tbl_mau_sac AS ms ON ctsan.mau_sac_id = ms.id
    LEFT JOIN tbl_dung_luong AS dl ON ctsan.dung_luong_id = dl.id
    LEFT JOIN tbl_nhan_vien AS nv ON pbh.nhan_vien_id = nv.id
        `;
        connect.query(sql, (err, data) => {
            res.render('admin/bao_hanh/bao_hanh.ejs', {
                data: data,
                user: req.session.user
            })
        })
    }
   
}

module.exports = new baohanhController ();