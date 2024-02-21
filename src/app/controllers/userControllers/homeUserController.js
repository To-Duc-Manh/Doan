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

}



module.exports = new homeUserController(); 