const connect = require('../../../config/db');
const moment = require('moment');
const helper = require('../../controllers/helper');

class DanhMucController {

    //tỉnh
    tinh(req, res) {
        let sql = "select * from tbl_thanh_pho ";

        connect.query(sql, (err, data) => {
            res.render('admin/danhmuc/tinh.ejs', {
                data: data
            });

        });
    }
    delete_tinh(req, res) {
        const tableName = 'tbl_thanh_pho';
        const tableId = 'thanh_pho_id';
        const redirectPath = 'tinh';
        helper.deleteRecord(tableName, tableId, redirectPath, req, res);
    }
    add_tinh(req, res) {
        const { ten_thanh_pho } = req.body;
        const tableName = 'tbl_thanh_pho';
        const checkColumn = 'ten_thanh_pho';
        const redirectPath = '/admin/tinh';

        helper.checkAndInsertRecord(tableName, { ten_thanh_pho: ten_thanh_pho }, checkColumn, redirectPath, req, res);
    }
    search_tinh(req, res) {
        const tableName = 'tbl_thanh_pho';
        const searchField = 'ten_thanh_pho';
        const redirectPath1 = 'danhmuc';
        const redirectPath2 = 'tinh';
        const queryParams = req.query.name;

        helper.searchInTable(req, res, tableName, searchField, redirectPath1, redirectPath2, queryParams);
    }
    //huyện
    huyen(req, res) {
        // Truy vấn danh sách thành phố
        let thanhPhoSql = "SELECT * FROM tbl_thanh_pho";

        connect.query(thanhPhoSql, (err, thanhPhoList) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }

            // Truy vấn danh sách huyện
            let huyenSql = "SELECT huyen.huyen_id as id, huyen.ten_huyen AS ten_huyen, thanh_pho.ten_thanh_pho AS ten_thanh_pho FROM tbl_huyen huyen JOIN tbl_thanh_pho thanh_pho ON huyen.thanh_pho_id = thanh_pho.thanh_pho_id;";

            connect.query(huyenSql, (err, data) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }

                res.render('admin/danhmuc/huyen.ejs', {
                    data: data,
                    thanhPhoList: thanhPhoList
                });
            });
        });
    }
    add_huyen(req, res) {
        const { ten_huyen, ten_thanh_pho } = req.body;
        const tableName = 'tbl_huyen';
        const checkColumn = 'ten_huyen';
        const redirectPath = '/admin/huyen';

        helper.checkAndInsertRecord(tableName, { ten_huyen: ten_huyen, thanh_pho_id: ten_thanh_pho }, checkColumn, redirectPath, req, res);
    }
    delete_huyen(req, res) {
        let id = req.params.id;

        // Create a User
        const deleteUserQuery = "DELETE FROM tbl_huyen WHERE huyen_id = ?";
        connect.query(deleteUserQuery, [id], (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/huyen');
        });
    };
    search_huyen(req, res) {
        const keyword = req.query.name;
        const thanhPhoId = req.query.thanh_pho_id;

        let huyenSql = "SELECT * FROM tbl_thanh_pho";

        connect.query(huyenSql, (err, thanhPhoList) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            let sql = "SELECT huyen.*, thanh_pho.* FROM tbl_huyen huyen JOIN tbl_thanh_pho thanh_pho ON huyen.thanh_pho_id = thanh_pho.thanh_pho_id WHERE 1 = 1";

            if (keyword) {
                sql += " AND huyen.ten_huyen LIKE ?";
            }

            if (thanhPhoId) {
                sql += " AND huyen.thanh_pho_id = ?";
            }

            // Tạo mảng tham số cho câu truy vấn
            const queryParams = [];

            // Thêm giá trị vào mảng tham số nếu có từ khóa
            if (keyword) {
                queryParams.push(`%${keyword}%`);
            }

            // Thêm giá trị vào mảng tham số nếu có giá trị được chọn từ thẻ select (thanh pho)
            if (thanhPhoId) {
                queryParams.push(thanhPhoId);
            }

            // Thực hiện truy vấn với mảng tham số
            connect.query(sql, queryParams, (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }

                res.render('admin/danhmuc/huyen.ejs', {
                    data: data,
                    thanhPhoList: thanhPhoList,
                });
            });
        });
    }

    //xa
    xa(req, res) {
        let thanhPhoSql = "SELECT * FROM tbl_thanh_pho";

        connect.query(thanhPhoSql, (err, thanhPhoList) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            let huyenSql = "SELECT * FROM tbl_huyen";

            connect.query(huyenSql, (err, huyenList) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }

                let xaSql = "SELECT xa.xa_id as id, xa.ten_xa AS ten_xa, huyen.ten_huyen AS ten_huyen, thanh_pho.ten_thanh_pho AS ten_thanh_pho FROM tbl_xa xa JOIN tbl_huyen huyen ON xa.huyen_id = huyen.huyen_id JOIN tbl_thanh_pho thanh_pho ON huyen.thanh_pho_id = thanh_pho.thanh_pho_id;";
                connect.query(xaSql, (err, data) => {
                    if (err) {
                        return res.status(500).send('Internal Server Error');
                    }
                    res.render('admin/danhmuc/xa.ejs', {
                        data: data,
                        thanhPhoList: thanhPhoList,
                        huyenList: huyenList
                    });
                });
            });
        });
    }
    add_xa(req, res) {
        const { ten_xa, ten_huyen } = req.body;
        const tableName = 'tbl_xa';
        const checkColumn = 'ten_xa';
        const redirectPath = '/admin/xa';

        helper.checkAndInsertRecord(tableName, { ten_xa: ten_xa, huyen_id: ten_huyen }, checkColumn, redirectPath, req, res);
    }
    delete_xa(req, res) {
        let id = req.params.id;

        // Create a User
        const deleteUserQuery = "DELETE FROM tbl_xa WHERE xa_id = ?";
        connect.query(deleteUserQuery, [id], (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/xa');
        });
    };

    //nhà cung cấp
    nhacungcap(req, res) {
        let sql = "select * from tbl_nha_cung_cap; ";

        connect.query(sql, (err, data) => {
            res.render('admin/danhmuc/nhacungcap.ejs', {
                data: data
            });

        });
    }
    add_nha_cung_cap(req, res) {
        const { ten_nha_cung_cap } = req.body;
        const tableName = 'tbl_nha_cung_cap';
        const checkColumn = 'ten_nha_cung_cap';
        const redirectPath = '/admin/nhacungcap';

        helper.checkAndInsertRecord(tableName, { ten_nha_cung_cap: ten_nha_cung_cap }, checkColumn, redirectPath, req, res);
    }
    hangsanxuat(req, res) {
        let sql = "select * from tbl_nha_san_xuat; ";

        connect.query(sql, (err, data) => {
            res.render('admin/danhmuc/hangsanxuat.ejs', {
                data: data
            });

        });
    }
    add_hangsanxuat(req, res) {
        const { ten_nha_san_xuat } = req.body;
        const tableName = 'tbl_nha_san_xuat';
        const checkColumn = 'ten_nha_san_xuat';
        const redirectPath = '/admin/hangsanxuat';

        helper.checkAndInsertRecord(tableName, { ten_nha_san_xuat: ten_nha_san_xuat }, checkColumn, redirectPath, req, res);
    }
    delete_hangsanxuat(req, res) {
        const tableName = 'tbl_nha_san_xuat';
        const tableId = 'id';
        const redirectPath = 'hangsanxuat';
        helper.deleteRecord(tableName, tableId, redirectPath, req, res);
    }
    search_hangsanxuat(req, res) {
        const tableName = 'tbl_nha_san_xuat';
        const searchField = 'ten_nha_san_xuat';
        const redirectPath1 = 'danhmuc';
        const redirectPath2 = 'hangsanxuat';
        const queryParams = req.query.name;

        helper.searchInTable(req, res, tableName, searchField, redirectPath1, redirectPath2, queryParams);
    }
}

module.exports = new DanhMucController();