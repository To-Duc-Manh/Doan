const connect = require('../../../config/db');
const moment = require('moment');
const helper = require('../../controllers/helper');
const con = require('../../../config/db');

class nhapkhoController {

    index(req, res) {
        let sql = `
            SELECT p.*, nv.ten_nhan_vien AS ten_nhan_vien_tao
            FROM tbl_phieu_nhap_kho p
            JOIN tbl_nhan_vien nv ON p.nhan_vien_tao_id = nv.id
        `;

        connect.query(sql, (err, phieunhapkho) => {
            res.render('admin/nhap_kho/nhap_kho.ejs', {
                user: req.session.user,
                phieunhapkho: phieunhapkho
            });
        });
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

        let sqlPhieuNhapKho = `SELECT 
        pnk.id as id_phieu_nhap_kho,
        pnk.nhan_vien_tao_id,
        pnk.nha_cung_cap_id,
        pnk.tong_tien,
        pnk.ghi_chu,
        pnk.trang_thai,
        nv.ten_nhan_vien AS ten_nhan_vien_tao,
        ncc.*
    FROM 
        tbl_phieu_nhap_kho pnk
    JOIN 
        tbl_nhan_vien nv ON pnk.nhan_vien_tao_id = nv.id
    JOIN
        tbl_nha_cung_cap ncc ON pnk.nha_cung_cap_id = ncc.id
    WHERE 
        pnk.id = ?;
    `;

        connect.query(sqlPhieuNhapKho, [id], (err, phieu_nhap_kho) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (phieu_nhap_kho.length === 0) {
                console.log("Không tìm thấy phiếu nhập kho với id là " + id);
                return res.status(404).send("Không tìm thấy phiếu nhập kho với id là " + id);
            }

            let sqlChiTietNhapKho = `
                SELECT 
                    c.*,
                    s.ten_san_pham,
                    m.ten_mau_sac,
                    d.ten_dung_luong
                FROM 
                    tbl_chi_tiet_phieu_nhap_kho c
                JOIN 
                    tbl_chi_tiet_san_pham t ON c.san_pham_chi_tiet_id = t.id
                JOIN
                    tbl_san_pham s ON t.san_pham_id = s.id
                JOIN
                    tbl_mau_sac m ON t.mau_sac_id = m.id
                JOIN
                    tbl_dung_luong d ON t.dung_luong_id = d.id
                WHERE 
                    c.phieu_nhap_kho_id = ?
            `;

            connect.query(sqlChiTietNhapKho, [id], (err, chi_tiet_nhap_kho) => {
                if (err) {
                    return res.status(500).send(err);
                }

                res.render('admin/nhap_kho/chi_tiet_nhap_kho.ejs', {
                    user: req.session.user,
                    phieu_nhap_kho: phieu_nhap_kho[0],
                    chi_tiet_nhap_kho: chi_tiet_nhap_kho,
                });
                console.log(phieu_nhap_kho[0]);
            });
        });
    }

    xuatHoaDonPDF_nhapkho(req, res) {
        const pdf = require('html-pdf');
        const path = require('path');

        let id = req.params.id;

        let sqlPhieuNhapKho = `SELECT 
            pnk.*,
            nv.ten_nhan_vien AS ten_nhan_vien_tao,
            ncc.*
        FROM 
            tbl_phieu_nhap_kho pnk
        JOIN 
            tbl_nhan_vien nv ON pnk.nhan_vien_tao_id = nv.id
        JOIN
            tbl_nha_cung_cap ncc ON pnk.nha_cung_cap_id = ncc.id
        WHERE 
            pnk.id = ?;
        `;

        connect.query(sqlPhieuNhapKho, [id], (err, phieu_nhap_kho) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (phieu_nhap_kho.length === 0) {
                console.log("Không tìm thấy phiếu nhập kho với id là " + id);
                return res.status(404).send("Không tìm thấy phiếu nhập kho với id là " + id);
            }

            let sqlChiTietNhapKho = `
                SELECT 
                    c.*,
                    s.ten_san_pham,
                    s.so_thang_bao_hanh,
                    m.ten_mau_sac,
                    d.ten_dung_luong
                FROM 
                    tbl_chi_tiet_phieu_nhap_kho c
                JOIN 
                    tbl_chi_tiet_san_pham t ON c.san_pham_chi_tiet_id = t.id
                JOIN
                    tbl_san_pham s ON t.san_pham_id = s.id
                JOIN
                    tbl_mau_sac m ON t.mau_sac_id = m.id
                JOIN
                    tbl_dung_luong d ON t.dung_luong_id = d.id
                WHERE 
                    c.phieu_nhap_kho_id = ?
            `;

            connect.query(sqlChiTietNhapKho, [id], (err, chi_tiet_nhap_kho) => {
                if (err) {
                    return res.status(500).send(err);
                }

                // Tạo HTML động
                let html = `
                <div class="content-wrapper">
                    <h2 class="text-center font-weight"> Đơn nhập kho</h2>
                    <hr>
    
                    <div class="row">
                        <div class="col-md-6">
                            <p><span class="font-weight">Tên nhà cung cấp:</span> ${phieu_nhap_kho[0].ten_nha_cung_cap}</p>
                            <p><span class="font-weight">Số điện thoại:</span> ${phieu_nhap_kho[0].so_dien_thoai}</p>
                        </div>
                        <div class="col-md-6">
                            <p><span class="font-weight">Địa chỉ:</span> ${phieu_nhap_kho[0].dia_chi}</p>
                            <p><span class="font-weight">Email:</span> ${phieu_nhap_kho[0].email}</p>
                        </div>
                    </div>
    
                    <table style="margin-top: 50px;" class="table table-PW table-hover table-borderless align-middle">
                        <thead class="table-light">
                            <caption>Danh sách sản phẩm</caption>
                            <tr style="background-color: #d2d2d2;">
                                <th>Tên sản phẩm</th>
                                <th>Màu sắc</th>
                                <th>Dung lượng</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>Tổng tiền</th>
                          
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            ${chi_tiet_nhap_kho && chi_tiet_nhap_kho.length > 0 ?
                        chi_tiet_nhap_kho.map(hoadon => `
                                    <tr>
                                        <td>${hoadon.ten_san_pham}</td>
                                        <td>${hoadon.ten_mau_sac}</td>
                                        <td>${hoadon.ten_dung_luong}</td>
                                        <td>${hoadon.so_luong}</td>
                                        <td>${hoadon.gia}</td>
                                        <td>${hoadon.so_luong * hoadon.gia}</td>
                                
                                    </tr>
                                `).join('') :
                        `<tr>
                                    <td colspan="7">Không có dữ liệu</td>
                                </tr>`
                    }
                        </tbody>
                    </table>
    
                    <div class="row mt-5">
                        <div class="col-lg-4">
    
                        </div>
                        <div class="col-lg-4"></div>
                        <div class="col-lg-4">
                            <p class="font-weight">Tổng tiền thanh toán: ${phieu_nhap_kho[0].tong_tien} đ</p>
                        </div>
                    </div>
    
                </div>
                `;

                let options = {
                    format: 'A4',
                    border: {
                        top: '0.5in',
                        right: '0.5in',
                        bottom: '0.5in',
                        left: '0.5in'
                    }
                };

                const outputPath = 'C:\\Users\\Admin\\Downloads\\hoadon_nhapkho.pdf';

                pdf.create(html, options).toFile(outputPath, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    // Trả về file PDF đã tạo
                    res.sendFile(outputPath);
                });
            });
        });
    };

    xoa_nhapkho(req, res) {
        let id = req.params.id;
        connect.query(`DELETE FROM tbl_phieu_nhap_kho WHERE id = ${id}`,
            (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.redirect('/admin/nhapkho');
            });
    }


}

module.exports = new nhapkhoController();