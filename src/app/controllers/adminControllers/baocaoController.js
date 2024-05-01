const connect = require('../../../config/db');
const moment = require('moment');
const helper = require('../../controllers/helper');
const con = require('../../../config/db');

class baocaoController {

    index(req, res) {
        const sql = `
            SELECT 
                sp.id AS chi_tiet_san_pham_id,
                sp.ten_san_pham,
                cts.hinh_anh,
                ms.ten_mau_sac,
                dl.ten_dung_luong,
                COALESCE(pnk.so_luong_nhap, 0) AS so_luong_nhap,
                COALESCE(dmh.so_luong_ban, 0) AS so_luong_ban,
                COALESCE(pdg.so_luong_dang_giao, 0) AS so_luong_dang_giao,
                COALESCE(pnk.so_luong_nhap, 0) - COALESCE(dmh.so_luong_ban, 0) - COALESCE(pdg.so_luong_dang_giao, 0) AS so_luong_con_lai
            FROM 
                tbl_san_pham AS sp
            JOIN 
                tbl_chi_tiet_san_pham AS cts ON sp.id = cts.san_pham_id
            JOIN 
                tbl_mau_sac AS ms ON cts.mau_sac_id = ms.id
            JOIN 
                tbl_dung_luong AS dl ON cts.dung_luong_id = dl.id
            LEFT JOIN (
                SELECT 
                    san_pham_chi_tiet_id,
                    SUM(so_luong) AS so_luong_nhap
                FROM 
                    tbl_chi_tiet_phieu_nhap_kho
                GROUP BY 
                    san_pham_chi_tiet_id) AS pnk ON cts.id = pnk.san_pham_chi_tiet_id
            LEFT JOIN (
                SELECT 
                    chi_tiet_san_pham_id,
                    SUM(so_luong) AS so_luong_ban
                FROM 
                    tbl_chi_tiet_don_mua_hang
                JOIN 
                    tbl_don_mua_hang AS dmh ON tbl_chi_tiet_don_mua_hang.don_mua_hang_id = dmh.id
                WHERE 
                    dmh.trang_thai IN (4, 6)
                GROUP BY 
                    chi_tiet_san_pham_id) AS dmh ON cts.id = dmh.chi_tiet_san_pham_id
            LEFT JOIN (
                SELECT 
                    chi_tiet_san_pham_id,
                    SUM(so_luong) AS so_luong_dang_giao
                FROM 
                    tbl_chi_tiet_don_mua_hang
                JOIN 
                    tbl_don_mua_hang AS dmh ON tbl_chi_tiet_don_mua_hang.don_mua_hang_id = dmh.id
                WHERE 
                    dmh.trang_thai IN (1, 2, 3)
                GROUP BY 
                    chi_tiet_san_pham_id) AS pdg ON cts.id = pdg.chi_tiet_san_pham_id;
        `;

        connect.query(sql, (err, data) => {
            res.render('admin/bao_cao/bao_cao.ejs', {
                user: req.session.user,
                data: data
            });
        });
    }


    search_baocao(req, res) {
        let name = req.query.name;

        const sql_ = `SELECT 
            sp.id AS chi_tiet_san_pham_id,
            sp.ten_san_pham,
            cts.hinh_anh,
            ms.ten_mau_sac,
            dl.ten_dung_luong,
            COALESCE(pnk.so_luong_nhap, 0) AS so_luong_nhap,
            COALESCE(dmh.so_luong_ban, 0) AS so_luong_ban,
            COALESCE(pnk.so_luong_nhap, 0) - COALESCE(dmh.so_luong_ban, 0) AS so_luong_con_lai
        FROM 
            tbl_san_pham AS sp
        JOIN 
            tbl_chi_tiet_san_pham AS cts ON sp.id = cts.san_pham_id
        JOIN 
            tbl_mau_sac AS ms ON cts.mau_sac_id = ms.id
        JOIN 
            tbl_dung_luong AS dl ON cts.dung_luong_id = dl.id
        LEFT JOIN (
            SELECT 
                san_pham_chi_tiet_id,
                SUM(so_luong) AS so_luong_nhap
            FROM 
                tbl_chi_tiet_phieu_nhap_kho
            GROUP BY 
                san_pham_chi_tiet_id
        ) AS pnk ON cts.id = pnk.san_pham_chi_tiet_id
        LEFT JOIN (
            SELECT 
                chi_tiet_san_pham_id,
                SUM(so_luong) AS so_luong_ban
            FROM 
                tbl_chi_tiet_don_mua_hang
            JOIN 
                tbl_don_mua_hang AS dmh ON tbl_chi_tiet_don_mua_hang.don_mua_hang_id = dmh.id
            WHERE 
                dmh.trang_thai IN (4, 6)
            GROUP BY 
                chi_tiet_san_pham_id
        ) AS dmh ON cts.id = dmh.chi_tiet_san_pham_id
        WHERE 
            sp.ten_san_pham LIKE ?`;

        connect.query(sql_, [`%${name}%`], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('admin/bao_cao/bao_cao.ejs', {
                user: req.session.user,
                data: data
            });
        });
    }


}

module.exports = new baocaoController();