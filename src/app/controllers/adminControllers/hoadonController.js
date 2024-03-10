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

    them_hoa_don(req, res) {
        res.render('admin/hoa_don/add_hoa_don.ejs', {
            user: req.session.user
        });
    }

    them_don_mua_hang(req, res) {
        const orderData = req.body;
        const selectedProducts = orderData.selected_products;

        // Tạo đơn mua hàng
        const insertOrderQuery = `INSERT INTO tbl_don_mua_hang (ten_nguoi_mua, so_dien_thoai, dia_chi_mua_hang, ngay_tao, ngay_cap_nhat) VALUES (?, ?, ?, ?, ?)`;
        const orderValues = [
            orderData.ten_nguoi_mua,
            orderData.so_dien_thoai,
            orderData.dia_chi_mua_hang,
            new Date(), // Ngày tạo (hiện tại)
            new Date() // Ngày cập nhật (hiện tại)
        ];

        connection.query(insertOrderQuery, orderValues, (error, results, fields) => {
            if (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            const orderId = results.insertId;

            // Tạo các chi tiết đơn mua hàng
            const insertDetailQuery = `INSERT INTO tbl_chi_tiet_don_mua_hang (don_mua_hang_id, chi_tiet_san_pham_id, so_luong, gia, ngay_tao, ngay_cap_nhat) VALUES ?`;
            const detailValues = selectedProducts.map(productId => [
                orderId,
                productId,
                1, // Số lượng (tạm thời mặc định là 1)
                0, // Giá (tạm thời mặc định là 0)
                new Date(), // Ngày tạo (hiện tại)
                new Date() // Ngày cập nhật (hiện tại)
            ]);

            connection.query(insertDetailQuery, [detailValues], (error, results, fields) => {
                if (error) {
                    console.error('Error:', error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                res.json({ message: 'Đã thêm đơn mua hàng thành công!' });
            });
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

}


module.exports = new hoadonController(); 
