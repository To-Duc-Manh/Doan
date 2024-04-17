const connect = require('../../../config/db');
const moment = require('moment');
const helper = require('../../controllers/helper');
const con = require('../../../config/db');

class baohanhController {

    index(req, res) {

        let sql_ = `SELECT * FROM tbl_don_mua_hang`;

        connect.query(sql_, (err, don_mua_hang) => {
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
                    user: req.session.user,
                    don_mua_hang: don_mua_hang
                })
            })
        })
    }

    add_baohanh(req, res) {
        const { chi_tiet_don_mua_hang_id, loai_bao_hanh, tieu_de, ngay_bat_dau, ngay_ket_thuc, ghi_chu, chi_phi, trang_thai } = req.body;

        if (chi_tiet_don_mua_hang_id && loai_bao_hanh && tieu_de && ngay_bat_dau && ngay_ket_thuc && trang_thai) {

            const newUser = {
                chi_tiet_don_mua_hang_id: chi_tiet_don_mua_hang_id,
                nhan_vien_id: req.session.user.id,
                loai_bao_hanh: loai_bao_hanh, // Note: In a production environment, you should hash or encrypt the password
                tieu_de: tieu_de,
                ngay_bat_dau: ngay_bat_dau,
                ngay_ket_thuc: ngay_ket_thuc,
                ghi_chu: ghi_chu,
                chi_phi: chi_phi,
                trang_thai: trang_thai
            };
            const insertUserQuery = "INSERT INTO tbl_phieu_bao_hanh SET ?";
            connect.query(insertUserQuery, newUser, (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }
                console.log("created user: ", { ...newUser });
                // Handle email verification or any other steps here
                res.redirect('/admin/baohanh');
            });
        } else {

        }
    }
    getChiTietSanPhamByDonHang(req, res) {
        let donHangId = req.query.id;

        let sql = `
        SELECT 
            ctdmh.id,
            sp.ten_san_pham AS TenSanPham,
            ms.ten_mau_sac AS MauSac,
            dl.ten_dung_luong AS DungLuong
        FROM tbl_chi_tiet_don_mua_hang AS ctdmh
        INNER JOIN tbl_chi_tiet_san_pham AS ctps ON ctdmh.chi_tiet_san_pham_id = ctps.id
        INNER JOIN tbl_san_pham AS sp ON ctps.san_pham_id = sp.id
        INNER JOIN tbl_mau_sac AS ms ON ctps.mau_sac_id = ms.id
        INNER JOIN tbl_dung_luong AS dl ON ctps.dung_luong_id = dl.id
        WHERE ctdmh.don_mua_hang_id = ?
    `;
        connect.query(sql, [donHangId], (err, data) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json(data);

        });
    }
    edit_baohanh(req, res) {
        let id = req.params.id;
        connect.query(`
            SELECT 
                pbh.id ,
                pbh.serial AS phieu_bao_hanh_serial,
                pbh.nhan_vien_id,
                pbh.tieu_de,
                pbh.loai_bao_hanh,
                pbh.ghi_chu,
                pbh.chi_phi,
                pbh.ngay_bat_dau,
                pbh.ngay_ket_thuc,
                pbh.ly_do_huy,
                pbh.trang_thai AS phieu_bao_hanh_trang_thai,
                ctsanpham.id AS chi_tiet_san_pham_id,
                ctsanpham.hinh_anh,
                sp.ten_san_pham,
                sp.so_thang_bao_hanh,
                ms.ten_mau_sac,
                dl.ten_dung_luong,
                ctsanpham.gia_ban,
                ctsanpham.serial AS chi_tiet_san_pham_serial,
                ctsanpham.ngay_tao AS chi_tiet_san_pham_ngay_tao,
                ctsanpham.ngay_cap_nhat AS chi_tiet_san_pham_ngay_cap_nhat
            FROM 
                tbl_phieu_bao_hanh AS pbh
            JOIN 
                tbl_chi_tiet_don_mua_hang AS ctdonmua ON pbh.chi_tiet_don_mua_hang_id = ctdonmua.id
            JOIN 
                tbl_chi_tiet_san_pham AS ctsanpham ON ctdonmua.chi_tiet_san_pham_id = ctsanpham.id
            JOIN 
                tbl_san_pham AS sp ON ctsanpham.san_pham_id = sp.id
            JOIN 
                tbl_mau_sac AS ms ON ctsanpham.mau_sac_id = ms.id
            JOIN 
                tbl_dung_luong AS dl ON ctsanpham.dung_luong_id = dl.id
            WHERE pbh.id = ${id}`,
            (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.render('admin/bao_hanh/edit_bao_hanh.ejs', {
                    data: data[0]
                });
            });
    }

    update_baohanh(req, res) {
        let id = req.params.id;
        console.log(id)
        const { loai_bao_hanh, tieu_de, ngay_bat_dau, ngay_ket_thuc, ghi_chu, chi_phi, trang_thai } = req.body;
        console.log(loai_bao_hanh);
        // Create a User
        const sql = "UPDATE tbl_phieu_bao_hanh SET ? where id = ?";
        connect.query(sql, [{ loai_bao_hanh, tieu_de, ngay_bat_dau, ngay_ket_thuc, ghi_chu, chi_phi, trang_thai }, id], (err, result) => {

            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/baohanh');
        });
    }
    chi_tiet_bao_hanh(req, res) {
        let id = req.params.id;

        let sql_ = `
        SELECT 
            pbh.id,
            pbh.serial AS phieu_bao_hanh_serial,
            pbh.nhan_vien_id,
            CASE
                WHEN nv.id IS NOT NULL THEN nv.ten_nhan_vien
                ELSE NULL
            END AS ten_nhan_vien,
            pbh.tieu_de,
            pbh.loai_bao_hanh,
            pbh.ghi_chu,
            pbh.chi_phi,
            pbh.ngay_bat_dau,
            pbh.ngay_ket_thuc,
            pbh.ly_do_huy,
            pbh.trang_thai AS phieu_bao_hanh_trang_thai,
            ctdonmua.id AS chi_tiet_don_mua_hang_id,
            ctsanpham.id AS chi_tiet_san_pham_id,
            ctsanpham.hinh_anh,
            sp.ten_san_pham,
            sp.so_thang_bao_hanh,
            ms.ten_mau_sac,
            dl.ten_dung_luong,
            ctsanpham.gia_ban,
            ctsanpham.serial AS chi_tiet_san_pham_serial,
            ctsanpham.ngay_tao AS chi_tiet_san_pham_ngay_tao,
            ctsanpham.ngay_cap_nhat AS chi_tiet_san_pham_ngay_cap_nhat,
            dmh.id AS don_mua_hang_id,
            dmh.ten_nguoi_mua,
            dmh.so_dien_thoai,
            dmh.dia_chi_mua_hang,
            dmh.ghi_chu AS don_mua_hang_ghi_chu,
            dmh.tong_tien,
            dmh.phi_van_chuyen,
            dmh.tong_tien_thanh_toan,
            dmh.hinh_thuc_thanh_toan,
            dmh.trang_thai AS don_mua_hang_trang_thai,
            dmh.ngay_huy,
            dmh.ly_do_huy AS don_mua_hang_ly_do_huy,
            dmh.hinh_anh_giao_hang
        FROM 
            tbl_phieu_bao_hanh AS pbh
        JOIN 
            tbl_chi_tiet_don_mua_hang AS ctdonmua ON pbh.chi_tiet_don_mua_hang_id = ctdonmua.id
        JOIN 
            tbl_chi_tiet_san_pham AS ctsanpham ON ctdonmua.chi_tiet_san_pham_id = ctsanpham.id
        JOIN 
            tbl_san_pham AS sp ON ctsanpham.san_pham_id = sp.id
        JOIN 
            tbl_mau_sac AS ms ON ctsanpham.mau_sac_id = ms.id
        JOIN 
            tbl_dung_luong AS dl ON ctsanpham.dung_luong_id = dl.id
        JOIN 
            tbl_don_mua_hang AS dmh ON ctdonmua.don_mua_hang_id = dmh.id
        LEFT JOIN 
            tbl_nhan_vien AS nv ON pbh.nhan_vien_id = nv.id
        WHERE pbh.id = ?`;

        connect.query(sql_, [id], (err, don_bao_hanh) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

            if (don_bao_hanh.length === 0) {
                console.log("Không tìm thấy đơn bảo hành với id là " + id);
                return res.status(404).send("Không tìm thấy đơn bảo hành với id là " + id);
            }

            res.render('admin/bao_hanh/chi_tiet_bao_hanh.ejs', {
                user: req.session.user,
                don_bao_hanh: don_bao_hanh[0], // Truyền phần tử đầu tiên của mảng
            });
            console.log(don_bao_hanh);
        });
    }




}

module.exports = new baohanhController();