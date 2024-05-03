const connect = require('../../../config/db');
const moment = require('moment');

const helper = require('../../controllers/helper');
const { json } = require('express');
const paginate = require('express-paginate');

class hoadonController {

    index(req, res) {
        const perPage = 6; // Số lượng mục trên mỗi trang
        let page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1 nếu không có yêu cầu

        // Đảm bảo trang không nhỏ hơn 1 và không lớn hơn tổng số trang
        if (page < 1) {
            page = 1;
        }

        // Tính offset để lấy dữ liệu từ cơ sở dữ liệu
        const offset = (page - 1) * perPage;

        // Truy vấn để lấy số lượng tổng cộng của mục
        const countQuery = "SELECT COUNT(*) AS totalCount FROM tbl_don_mua_hang";

        connect.query(countQuery, (err, countResult) => {
            if (err) {
                throw err;
            }
            const totalCount = countResult[0].totalCount;

            // Tính tổng số trang
            const totalPages = Math.ceil(totalCount / perPage);

            // Đảm bảo trang không lớn hơn tổng số trang
            if (page > totalPages) {
                page = totalPages;
            }

            // Truy vấn để lấy dữ liệu cho trang hiện tại
            const sql = `SELECT tbl_don_mua_hang.*, tbl_nhan_vien.ten_nhan_vien 
                         FROM tbl_don_mua_hang 
                         LEFT JOIN tbl_nhan_vien ON tbl_don_mua_hang.nhan_vien_id = tbl_nhan_vien.id
                         LIMIT ${perPage} OFFSET ${offset}`;

            connect.query(sql, (err, data) => {
                if (err) {
                    throw err;
                }

                // Render template với dữ liệu và thông tin phân trang
                res.render('admin/hoa_don/hoa_don.ejs', {
                    data: data,
                    user: req.session.user,
                    pageCount: totalPages,
                    itemCount: totalCount,
                    currentPage: page, // Thêm currentPage vào để biết trang hiện tại
                    pages: paginate.getArrayPages(req)(3, totalPages, page)
                });
            });
        });
    }

    chi_tiet_hoa_don(req, res) {
        let id = req.params.id;

        let sqlDonHang = "SELECT * FROM tbl_don_mua_hang WHERE id = ?";

        connect.query(sqlDonHang, [id], (err, don_mua_hang) => {
            if (err) throw err;

            if (don_mua_hang.length === 0) {
                // Xử lý trường hợp không có dữ liệu
                console.log("Không tìm thấy đơn mua hàng với id là " + id);
                // Trả về trang lỗi hoặc thông báo phù hợp
                res.status(404).send("Không tìm thấy đơn mua hàng với id là " + id);
                return;
            }

            let sqlChiTietDonHang = `
                SELECT 
                    c.*,
                    s.ten_san_pham,
                    m.ten_mau_sac,
                    d.ten_dung_luong
                FROM 
                    tbl_chi_tiet_don_mua_hang c
                JOIN 
                    tbl_chi_tiet_san_pham t ON c.chi_tiet_san_pham_id = t.id
                JOIN
                    tbl_san_pham s ON t.san_pham_id = s.id
                JOIN
                    tbl_mau_sac m ON t.mau_sac_id = m.id
                JOIN
                    tbl_dung_luong d ON t.dung_luong_id = d.id
                WHERE 
                    c.don_mua_hang_id = ?
            `;

            connect.query(sqlChiTietDonHang, [id], (err, chi_tiet_hoa_don) => {
                if (err) throw err;

                res.render('admin/hoa_don/chi_tiet_hd.ejs', {
                    user: req.session.user,
                    don_mua_hang: don_mua_hang[0], // Truyền phần tử đầu tiên của mảng
                    chi_tiet_hoa_don: chi_tiet_hoa_don,
                });
            });
        });
    }


    xuatHoaDonPDF(req, res) {
        // Lấy dữ liệu từ req hoặc truy vấn từ CSDL nếu cần
        const pdf = require('html-pdf');
        const path = require('path');

        let id = req.params.id;

        let sql_ = "SELECT * FROM tbl_don_mua_hang WHERE id = ?";

        connect.query(sql_, [id], (err, don_mua_hang) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (don_mua_hang.length === 0) {
                console.log("Không tìm thấy đơn mua hàng với id là " + id);
                return res.status(404).send("Không tìm thấy đơn mua hàng với id là " + id);
            }

            let sql = `SELECT 
            c.*,
            s.ten_san_pham,
            m.ten_mau_sac,
            d.ten_dung_luong
        FROM 
            tbl_chi_tiet_don_mua_hang c
        JOIN 
            tbl_chi_tiet_san_pham t ON c.chi_tiet_san_pham_id = t.id
        JOIN
            tbl_san_pham s ON t.san_pham_id = s.id
        JOIN
            tbl_mau_sac m ON t.mau_sac_id = m.id
        JOIN
            tbl_dung_luong d ON t.dung_luong_id = d.id
        WHERE 
            c.don_mua_hang_id = ?`;

            connect.query(sql, [id], (err, chi_tiet_hoa_don) => {
                if (err) {
                    return res.status(500).send(err);
                }

                // Tạo HTML động
                let html = `
                <div class="content-wrapper">
                    <h2 class="text-center font-weight"> Đơn bán hàng</h2>
                    <hr>
    
                    <div class="row">
                        <div class="col-md-6">
                            <p><span class="font-weight">Tên khách hàng:</span> ${don_mua_hang[0].ten_nguoi_mua}</p>
                            <p><span class="font-weight">Số điện thoại:</span> ${don_mua_hang[0].so_dien_thoai}</p>
                        </div>
                        <div class="col-md-6">
                            <p><span class="font-weight">Địa chỉ:</span> ${don_mua_hang[0].dia_chi_mua_hang}</p>
                            <p><span class="font-weight">Ghi chú:</span> ${don_mua_hang[0].ghi_chu}</p>
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
                            ${chi_tiet_hoa_don && chi_tiet_hoa_don.length > 0 ?
                        chi_tiet_hoa_don.map(hoadon => `
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
                            <p class="font-weight">Tổng tiền: ${don_mua_hang[0].tong_tien_thanh_toan} đ</p>
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

                const outputPath = 'C:\\Users\\Admin\\Downloads\\hoadon.pdf';

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


    get_sp_don_mua_hang(req, res) {
        let sql = "SELECT * FROM tbl_chi_tiet_san_pham";
        connect.query(sql, (err, san_pham) => {
            res.render('admin/hoa_don/add_hoa_don.ejs', {
                san_pham: san_pham,
                user: req.session.user
            });
        })
    }

    search_khach_hang_hd(req, res) {
        const keyword = req.query.ten_khach_hang;
        if (!keyword) {
            console.log('Vui lòng nhập tên khách hàng');
            res.status(400).json({ error: 'Vui lòng nhập từ khóa tìm kiếm.' });
            return;
        }
        const sql = `select * from tbl_khach_hang where ho_ten like '%${keyword}%'`;
        connect.query(sql, (err, khach_hang) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm khách hàng.' });
                return;
            }
            res.json(khach_hang);
        })

    }
    search_sp_hd(req, res) {
        const keyword = req.query.name;
        if (!keyword) {
            console.log('Vui lòng nhập từ khóa tìm kiếm.');
            res.status(400).json({ error: 'Vui lòng nhập từ khóa tìm kiếm.' });
            return;
        }

        const sql = `
            SELECT 
                sp.*,
                ctsp.id,
                ctsp.hinh_anh AS hinh_anh_san_pham,
                ctsp.gia_ban,
                mau_sac.ten_mau_sac,
                dl.ten_dung_luong
            FROM 
                tbl_chi_tiet_san_pham AS ctsp
            INNER JOIN 
                tbl_san_pham AS sp ON ctsp.san_pham_id = sp.id
            LEFT JOIN 
                tbl_mau_sac AS mau_sac ON ctsp.mau_sac_id = mau_sac.id
            LEFT JOIN 
                tbl_dung_luong AS dl ON ctsp.dung_luong_id = dl.id
            WHERE 
                sp.ten_san_pham LIKE '%${keyword}%'
        `;
        connect.query(sql, (err, san_pham) => {
            if (err) {
                console.error('Lỗi khi tìm kiếm sản phẩm:', err);
                res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm sản phẩm.' });
                return;
            }
            res.json(san_pham);
        });
    }

    them_don_mua_hang_get(req, res) {
        const { khach_hang_id, ten_nguoi_mua, sdt, san_pham, dia_chi_mua_hang, ghi_chu } = req.body;
        const user = req.session.user.id;
        console.log(req.body);

        // Tính tổng tiền từ sản phẩm đã chọn
        const tong_tien = san_pham.reduce((acc, sp) => acc + sp.so_luong * sp.gia, 0);

        const donHangQuery = `INSERT INTO tbl_don_mua_hang (nhan_vien_id, khach_hang_id, ten_nguoi_mua, so_dien_thoai, dia_chi_mua_hang, ghi_chu, tong_tien, tong_tien_thanh_toan, hinh_thuc_thanh_toan, trang_thai, ngay_tao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const donHangValues = [user, khach_hang_id, ten_nguoi_mua, sdt, dia_chi_mua_hang, ghi_chu, tong_tien, 0, 1, 1];

        connect.query(donHangQuery, donHangValues, (error, results, fields) => {
            if (error) {
                console.error('Lỗi khi thêm đơn hàng: ' + error);
                res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm đơn hàng.' });
                return;
            }

            const donMuaHangId = results.insertId;

            if (san_pham && Array.isArray(san_pham)) {
                san_pham.forEach((sp, index) => {
                    const chiTietQuery = `INSERT INTO tbl_chi_tiet_don_mua_hang (don_mua_hang_id, chi_tiet_san_pham_id, so_luong, gia, ngay_tao) VALUES (?, ?, ?, ?, NOW())`;
                    const chiTietValues = [donMuaHangId, sp.id, sp.so_luong, sp.gia];

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


    async chuyen_trang_thai(req, res) {
        try {
            // Lấy id của đơn hàng từ request
            const orderId = req.body.orderId;

            // Truy vấn trạng thái hiện tại của đơn hàng từ cơ sở dữ liệu
            const data = await new Promise((resolve, reject) => {
                connect.query(`SELECT * FROM tbl_don_mua_hang WHERE id = ${orderId}`, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            if (data.length === 0) {
                console.log('Không tìm thấy đơn hàng.');
                res.status(404).send('Không tìm thấy đơn hàng.');
                return;
            }

            const currentStatus = data[0].trang_thai;

            // Xác định trạng thái mới
            let newStatus;
            if (currentStatus === 1) {
                newStatus = 2;
            } else if (currentStatus === 2) {
                newStatus = 3;
            }
            else {
                console.log('Không có trạng thái nào phù hợp để cập nhật.');
                res.status(400).send('Không có trạng thái nào phù hợp để cập nhật.');
                return;
            }

            // Cập nhật trạng thái mới vào cơ sở dữ liệu
            await new Promise((resolve, reject) => {
                connect.query('UPDATE tbl_don_mua_hang SET trang_thai = ? WHERE id = ?', [newStatus, orderId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            console.log(`Cập nhật trạng thái thành công: ${newStatus} cho đơn hàng có id ${orderId}`);
            res.status(200).send(newStatus.toString()); // Trả về trạng thái mới
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            res.status(500).send('Lỗi khi cập nhật trạng thái.');
        }
    }

    hoan_thanh_gh(req, res) {
        let id = req.params.id;

        // Kiểm tra xem có hình ảnh được gửi lên không
        if (!req.file) {
            console.log("Không có hình ảnh được gửi lên");
            res.status(400).send("Không có hình ảnh được gửi lên");
            return;
        }
        // Tạo đối tượng mới chứa thông tin cần cập nhật

        const hinh_anh_giao_hang = req.file.originalname
        const trang_thai = 4

        // Truy vấn SQL để cập nhật thông tin vào bảng tbl_don_mua_hang
        const updateProductQuery = "UPDATE tbl_don_mua_hang SET ? WHERE id = ?";
        connect.query(updateProductQuery, [{ trang_thai, hinh_anh_giao_hang }, id], (err, result) => {
            if (err) {
                console.log("Lỗi: ", err);
                res.status(500).send("Lỗi máy chủ nội bộ");
                return;
            }
            // Xử lý bất kỳ bước bổ sung nào ở đây
            res.redirect('/admin/hoadon');
        });
    }

    edit_hoa_don(req, res) {
        let id = req.params.id;
        connect.query(`SELECT * FROM tbl_don_mua_hang WHERE id = ${id}`,
            (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                let sql = "SELECT * FROM tbl_chi_tiet_don_mua_hang WHERE don_mua_hang_id = ?";

                connect.query(sql, [id], (err, chi_tiet_hoa_don) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.render('admin/hoa_don/edit_hoa_don.ejs', {
                        data: data[0],
                        chi_tiet_hoa_don: chi_tiet_hoa_don
                    });
                })
            });
    }

    update_hoa_don(req, res) {
        let id = req.params.id;
        const { hinh_thuc_thanh_toan, trang_thai } = req.body;
        console.log(hinh_thuc_thanh_toan, trang_thai)
        let ngay_cap_nhat = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let sql = `UPDATE tbl_don_mua_hang SET ? WHERE id = ?`
        connect.query(sql, [{ hinh_thuc_thanh_toan, ngay_cap_nhat, trang_thai }, id], (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/hoadon');
        })
    }


    xoa_hoa_don(req, res) {
        let id = req.params.id;
        connect.query(`DELETE FROM tbl_don_mua_hang WHERE id = ${id}`,
            (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.redirect('/admin/hoadon');
            });
    }

    search_don_mua_hang(req, res) {
        const perPage = 6; // Số lượng mục trên mỗi trang
        let page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1 nếu không có yêu cầu
        const searchTerm = req.query.name; // Từ khóa tìm kiếm

        // Đảm bảo trang không nhỏ hơn 1
        if (page < 1) {
            page = 1;
        }

        // Tính offset để lấy dữ liệu từ cơ sở dữ liệu
        const offset = (page - 1) * perPage;

        // Truy vấn để lấy số lượng tổng cộng của mục theo từ khóa tìm kiếm
        const countQuery = `SELECT COUNT(*) AS totalCount FROM tbl_don_mua_hang WHERE ten_nguoi_mua LIKE '%${searchTerm}%'`;

        connect.query(countQuery, (err, countResult) => {
            if (err) {
                throw err;
            }
            const totalCount = countResult[0].totalCount;

            // Tính tổng số trang
            const totalPages = Math.ceil(totalCount / perPage);

            // Đảm bảo trang không lớn hơn tổng số trang
            if (page > totalPages) {
                page = totalPages;
            }

            // Truy vấn để lấy dữ liệu cho trang hiện tại với điều kiện tìm kiếm
            const sql = `SELECT tbl_don_mua_hang.*, tbl_nhan_vien.ten_nhan_vien 
                         FROM tbl_don_mua_hang 
                         LEFT JOIN tbl_nhan_vien ON tbl_don_mua_hang.nhan_vien_id = tbl_nhan_vien.id
                         WHERE ten_nguoi_mua LIKE '%${searchTerm}%'
                         LIMIT ${perPage} OFFSET ${offset}`;

            connect.query(sql, (err, data) => {
                if (err) {
                    throw err;
                }

                // Render template với dữ liệu và thông tin phân trang
                res.render('admin/hoa_don/hoa_don.ejs', {
                    data: data,
                    user: req.session.user,
                    pageCount: totalPages,
                    itemCount: totalCount,
                    currentPage: page,
                    pages: paginate.getArrayPages(req)(3, totalPages, page),
                    searchTerm: searchTerm // Truyền từ khóa tìm kiếm để hiển thị trên giao diện
                });
            });
        });
    }

}


module.exports = new hoadonController(); 
