const connect = require('../../../config/db');
const moment = require('moment');

const helper = require('../../controllers/helper');
class productController {
    product(req, res) {
        // Truy vấn danh sách danh mục sản phẩm
        let danhMucSql = "SELECT * FROM tbl_danh_muc";

        connect.query(danhMucSql, (err, danhMucList) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            // Truy vấn danh sách nhà sản xuất
            let nhaSanXuatSql = "SELECT * FROM tbl_nha_san_xuat";

            connect.query(nhaSanXuatSql, (err, nhaSanXuatList) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }

                // Truy vấn danh sách sản phẩm với thông tin danh mục và nhà sản xuất
                let sql = "SELECT tbl_san_pham.id, tbl_san_pham.ten_san_pham, tbl_san_pham.hinh_anh, tbl_san_pham.trang_thai, tbl_danh_muc.ten_danh_muc , tbl_nha_san_xuat.ten_nha_san_xuat, tbl_san_pham.so_thang_bao_hanh, tbl_san_pham.mo_ta FROM tbl_san_pham JOIN tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id;";

                connect.query(sql, (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }

                    res.render('admin/product/product.ejs', {
                        data: data,
                        danhMucList: danhMucList,
                        nhaSanXuatList: nhaSanXuatList
                    });
                });
            });
        });
    }
    search_product(req, res) {
        const keyword = req.query.name;
        const danhMucId = req.query.danh_muc_id;
        const nhaSanXuatId = req.query.nha_san_xuat_id;

        let danhMucSql = "SELECT * FROM tbl_danh_muc";

        connect.query(danhMucSql, (err, danhMucList) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            let nhaSanXuatSql = "SELECT * FROM tbl_nha_san_xuat";

            connect.query(nhaSanXuatSql, (err, nhaSanXuatList) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }

                let sql = "SELECT tbl_san_pham.id, tbl_san_pham.ten_san_pham, tbl_san_pham.hinh_anh, tbl_danh_muc.ten_danh_muc, tbl_nha_san_xuat.ten_nha_san_xuat, tbl_san_pham.so_thang_bao_hanh, tbl_san_pham.mo_ta FROM tbl_san_pham JOIN tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id WHERE 1 = 1";

                if (keyword) {
                    sql += " AND tbl_san_pham.ten_san_pham LIKE ?";
                }

                if (danhMucId) {
                    sql += " AND tbl_san_pham.danh_muc_id = ?";
                }

                if (nhaSanXuatId) {
                    sql += " AND tbl_san_pham.nha_san_xuat_id = ?";
                }

                // Tạo mảng tham số cho câu truy vấn
                const queryParams = [];

                // Thêm giá trị vào mảng tham số nếu có từ khóa
                if (keyword) {
                    queryParams.push(`%${keyword}%`);
                }

                // Thêm giá trị vào mảng tham số nếu có giá trị được chọn từ thẻ select (danh mục)
                if (danhMucId) {
                    queryParams.push(danhMucId);
                }

                // Thêm giá trị vào mảng tham số nếu có giá trị được chọn từ thẻ select (nhà sản xuất)
                if (nhaSanXuatId) {
                    queryParams.push(nhaSanXuatId);
                }

                // Thực hiện truy vấn với mảng tham số
                connect.query(sql, queryParams, (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }

                    res.render('admin/product/product.ejs', {
                        data: data,
                        danhMucList: danhMucList,
                        nhaSanXuatList: nhaSanXuatList
                    });
                });
            });
        });
    }
    add_product(req, res) {
        const {
            danh_muc_id,
            nha_san_xuat_id,
            ten_san_pham,
            so_thang_bao_hanh,
            mo_ta,
            trang_thai,
        } = req.body;

        if (ten_san_pham && danh_muc_id && nha_san_xuat_id && so_thang_bao_hanh && mo_ta && trang_thai) {
            const ngay_tao = moment().format('YYYY-MM-DD HH:mm:ss');

            const newProduct = {
                danh_muc_id: danh_muc_id,
                hinh_anh: req.file.originalname,
                nha_san_xuat_id: nha_san_xuat_id,
                ten_san_pham: ten_san_pham,
                so_thang_bao_hanh: so_thang_bao_hanh,
                mo_ta: mo_ta,
                trang_thai: trang_thai,
                ngay_tao: ngay_tao
            };

            const insertProductQuery = "INSERT INTO tbl_san_pham SET ?";
            connect.query(insertProductQuery, newProduct, (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }
                console.log("created product: ", { ...newProduct });
                // Handle any additional steps here
                res.redirect('/admin/product');
            });
        } else {
            const conflictError = 'Product information is required.';
            res.redirect('/admin/product');
        }
    }
    edit_product(req, res) {
        let id = req.params.id;
        // Truy vấn thông tin sản phẩm từ bảng tbl_san_pham
        connect.query(`SELECT tbl_san_pham.id,tbl_san_pham.danh_muc_id, tbl_san_pham.hinh_anh, tbl_san_pham.nha_san_xuat_id, tbl_san_pham.ten_san_pham, tbl_san_pham.trang_thai, tbl_danh_muc.ten_danh_muc , tbl_nha_san_xuat.ten_nha_san_xuat, tbl_san_pham.so_thang_bao_hanh, tbl_san_pham.mo_ta FROM tbl_san_pham JOIN tbl_danh_muc ON tbl_san_pham.danh_muc_id = tbl_danh_muc.id JOIN tbl_nha_san_xuat ON tbl_san_pham.nha_san_xuat_id = tbl_nha_san_xuat.id WHERE tbl_san_pham.id = ${id}`, (err, productData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            // Truy vấn danh sách danh mục sản phẩm
            let danhMucSql = "SELECT * FROM tbl_danh_muc";

            connect.query(danhMucSql, (err, danhMucList) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }

                // Truy vấn danh sách nhà sản xuất
                let nhaSanXuatSql = "SELECT * FROM tbl_nha_san_xuat";

                connect.query(nhaSanXuatSql, (err, nhaSanXuatList) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }

                    // Render trang chỉnh sửa sản phẩm với dữ liệu từ cả ba bảng
                    res.render('admin/product/edit_product.ejs', {
                        data: productData[0],
                        danhMucList: danhMucList,
                        nhaSanXuatList: nhaSanXuatList
                    });
                    console.log(productData[0]);
                });
            });
        });
    }
    update_product(req, res) {
        let id = req.params.id;

        const { danh_muc_id, nha_san_xuat_id, ten_san_pham, so_thang_bao_hanh, mo_ta, trang_thai } = req.body;
        const hinh_anh = req.file ? req.file.originalname : req.body.hinh_anh;
        // Create a User
        const insertUserQuery = "UPDATE tbl_san_pham SET ? where id = ?";
        connect.query(insertUserQuery, [{ danh_muc_id, hinh_anh, nha_san_xuat_id, ten_san_pham, so_thang_bao_hanh, mo_ta, trang_thai }, id], (err, result) => {

            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/product');
        });
    };

    //product_all
    product_all(req, res) {
        let sql_san_pham = "SELECT * FROM tbl_san_pham;";

        connect.query(sql_san_pham, (err, product) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }

            let sql_mau_sac = "SELECT * FROM tbl_mau_sac;";

            connect.query(sql_mau_sac, (err, mau_sac) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }

                let sql_dung_luong = "SELECT * FROM tbl_dung_luong;";

                connect.query(sql_dung_luong, (err, dung_luong) => {
                    if (err) {
                        return res.status(500).send('Internal Server Error');
                    }

                    let sql = "SELECT sp.ten_san_pham, ctsanpham.id, ctsanpham.hinh_anh AS hinh_anh_chi_tiet, mausac.ten_mau_sac, dungluong.ten_dung_luong, ctsanpham.gia_ban, ctsanpham.serial FROM tbl_san_pham sp JOIN tbl_chi_tiet_san_pham ctsanpham ON sp.id = ctsanpham.san_pham_id JOIN tbl_mau_sac mausac ON ctsanpham.mau_sac_id = mausac.id JOIN tbl_dung_luong dungluong ON ctsanpham.dung_luong_id = dungluong.id;";

                    connect.query(sql, (err, product_all) => {
                        if (err) {
                            return res.status(500).send('Internal Server Error');
                        }

                        res.render('admin/product/product_all.ejs', {
                            product_all: product_all,
                            product: product,
                            mau_sac: mau_sac,
                            dung_luong: dung_luong
                        });
                    });


                });
            });
            // Truy vấn danh sách huyện

        });
    }
    add_product_all(req, res) {
        const {
            san_pham_id,
            mau_sac_id,
            dung_luong_id,
            gia_ban,
            serial,
        } = req.body;

        if (dung_luong_id && san_pham_id && mau_sac_id && gia_ban && serial) {
            const ngay_tao = moment().format('YYYY-MM-DD HH:mm:ss');

            const newProduct = {
                hinh_anh: req.file.originalname,
                san_pham_id: san_pham_id,
                mau_sac_id: mau_sac_id,
                dung_luong_id: dung_luong_id,
                gia_ban: gia_ban,
                serial: serial,
                ngay_tao: ngay_tao
            };

            const insertProductQuery = "INSERT INTO tbl_chi_tiet_san_pham SET ?";
            connect.query(insertProductQuery, newProduct, (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }
                console.log("created product_all: ", { ...newProduct });
                // Handle any additional steps here
                res.redirect('/admin/product_all');
            });
        } else {
            const conflictError = 'Product_all information is required.';
            res.redirect('/admin/product_all');
        }
    }
    search_product_all(req, res) {
        const keyword = req.query.name;
        const mau_sac_id = req.query.mau_sac_id;
        const dung_luong_id = req.query.dung_luong_id;

        let mau_sac_sql = "SELECT * FROM tbl_mau_sac";
        let dung_luong_sql = "SELECT * FROM tbl_dung_luong";
        let sql_san_pham = "SELECT * FROM tbl_san_pham;";

        connect.query(mau_sac_sql, (err, mau_sac) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            connect.query(dung_luong_sql, (err, dung_luong) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }

                connect.query(sql_san_pham, (err, product) => {
                    let sql = `
                    SELECT 
                        sp.ten_san_pham, 
                        ctsanpham.hinh_anh AS hinh_anh_chi_tiet, 
                        mausac.ten_mau_sac, 
                        dungluong.ten_dung_luong, 
                        ctsanpham.gia_ban, 
                        ctsanpham.serial 
                    FROM 
                        tbl_san_pham sp 
                        JOIN tbl_chi_tiet_san_pham ctsanpham ON sp.id = ctsanpham.san_pham_id 
                        JOIN tbl_mau_sac mausac ON ctsanpham.mau_sac_id = mausac.id 
                        JOIN tbl_dung_luong dungluong ON ctsanpham.dung_luong_id = dungluong.id 
                    WHERE 1 = 1
                `;

                    const queryParams = [];

                    if (keyword) {
                        sql += " AND sp.ten_san_pham LIKE ?";
                        queryParams.push(`%${keyword}%`);
                    }

                    if (mau_sac_id) {
                        sql += " AND ctsanpham.mau_sac_id = ?";
                        queryParams.push(mau_sac_id);
                    }

                    if (dung_luong_id) {
                        sql += " AND ctsanpham.dung_luong_id = ?";
                        queryParams.push(dung_luong_id);
                    }

                    connect.query(sql, queryParams, (err, product_all) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Internal Server Error');
                        }

                        res.render('admin/product/product_all.ejs', {
                            product_all: product_all,
                            product: product,
                            mau_sac: mau_sac,
                            dung_luong: dung_luong
                        });
                    });
                });
            });
        });
    }
    searchPrice_product_all(req, res) {
        const min_price = req.query.min_price;
        const max_price = req.query.max_price;

        let mau_sac_sql = "SELECT * FROM tbl_mau_sac";
        let dung_luong_sql = "SELECT * FROM tbl_dung_luong";
        let sql_san_pham = "SELECT * FROM tbl_san_pham;";

        connect.query(mau_sac_sql, (err, mau_sac) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            connect.query(dung_luong_sql, (err, dung_luong) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }

                connect.query(sql_san_pham, (err, product) => {
                    let sql = `
                        SELECT 
                            sp.ten_san_pham, 
                            ctsanpham.hinh_anh AS hinh_anh_chi_tiet, 
                            mausac.ten_mau_sac, 
                            dungluong.ten_dung_luong, 
                            ctsanpham.gia_ban, 
                            ctsanpham.serial 
                        FROM 
                            tbl_san_pham sp 
                            JOIN tbl_chi_tiet_san_pham ctsanpham ON sp.id = ctsanpham.san_pham_id 
                            JOIN tbl_mau_sac mausac ON ctsanpham.mau_sac_id = mausac.id 
                            JOIN tbl_dung_luong dungluong ON ctsanpham.dung_luong_id = dungluong.id 
                        WHERE 1 = 1
                    `;

                    const queryParams = [];

                    // Kiểm tra và thêm điều kiện tìm kiếm giá
                    if (min_price && max_price) {
                        sql += " AND ctsanpham.gia_ban >= ? AND ctsanpham.gia_ban <= ?";
                        queryParams.push(min_price, max_price);
                    } else if (max_price) { // Nếu chỉ có max_price
                        sql += " AND ctsanpham.gia_ban <= ?";
                        queryParams.push(max_price);
                    }

                    connect.query(sql, queryParams, (err, product_all) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Internal Server Error');
                        }

                        res.render('admin/product/product_all.ejs', {
                            product_all: product_all,
                            product: product,
                            mau_sac: mau_sac,
                            dung_luong: dung_luong
                        });
                    });
                });
            });
        });
    }
    edit_product_all(req, res) {
        let id = req.params.id;
        // Truy vấn thông tin sản phẩm từ bảng tbl_san_pham
        connect.query(`
            SELECT 
                sp.ten_san_pham, 
                ctsanpham.id,
                ctsanpham.hinh_anh AS hinh_anh_chi_tiet, 
                mausac.ten_mau_sac, 
                dungluong.ten_dung_luong, 
                ctsanpham.mau_sac_id,
                ctsanpham.dung_luong_id,
                ctsanpham.gia_ban, 
                ctsanpham.serial 
            FROM 
                tbl_san_pham sp 
                JOIN tbl_chi_tiet_san_pham ctsanpham ON sp.id = ctsanpham.san_pham_id 
                JOIN tbl_mau_sac mausac ON ctsanpham.mau_sac_id = mausac.id 
                JOIN tbl_dung_luong dungluong ON ctsanpham.dung_luong_id = dungluong.id 

                WHERE ctsanpham.id = ${id}`, (err, productData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            // Truy vấn danh sách danh mục sản phẩm
            let mau_sacSql = "SELECT * FROM tbl_mau_sac";

            connect.query(mau_sacSql, (err, mau_sac_List) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }

                // Truy vấn danh sách nhà sản xuất
                let dung_luongSql = "SELECT * FROM tbl_dung_luong";

                connect.query(dung_luongSql, (err, dung_luong_List) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }

                    // Render trang chỉnh sửa sản phẩm với dữ liệu từ cả ba bảng
                    res.render('admin/product/edit_product_all.ejs', {
                        data: productData[0],
                        mau_sac_List: mau_sac_List,
                        dung_luong_List: dung_luong_List
                    });
                    console.log(productData[0]);
                });
            });
        });
    }
    update_product_all(req, res) {
        let id = req.params.id;

        const { mau_sac_id, dung_luong_id, gia_ban, serial } = req.body;
        const hinh_anh = req.file ? req.file.originalname : req.body.hinh_anh;
        // Create a User
        const insertUserQuery = "UPDATE tbl_chi_tiet_san_pham SET ? where id = ?";
        connect.query(insertUserQuery, [{ hinh_anh, mau_sac_id, dung_luong_id, gia_ban, serial }, id], (err, result) => {

            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/product_all');
        });
    };
    delete_product_all(req, res) {
        const tableName = 'tbl_chi_tiet_san_pham';
        const tableId = 'id';
        const redirectPath = 'product_all';
        helper.deleteRecord(tableName, tableId, redirectPath, req, res);
    }

    // uploadFile = (req, res) => {
    //     res.send({
    //         message: "File đã được upload thành công!",
    //         file: req.file,
    //     });
    // };
    danhmuc(req, res) {
        let sql = "select * from tbl_danh_muc; ";

        connect.query(sql, (err, data) => {
            res.render('admin/product/danhmucsp.ejs', {
                data: data
            });

        });
    }
    mau_sac(req, res) {
        let sql = "SELECT * FROM tbl_mau_sac;";
        connect.query(sql, (err, data) => {
            res.render('admin/product/mau_sac.ejs', {
                data: data
            });
        });
    }
    dung_luong(req, res) {
        let sql = "SELECT * FROM tbl_dung_luong;";
        connect.query(sql, (err, data) => {
            res.render('admin/product/dung_luong.ejs', {
                data: data
            });
        });
    }

    add_danh_muc(req, res) {
        const { ten_danh_muc } = req.body;
        const ngay_tao = moment().format('YYYY-MM-DD HH:mm:ss');
        const tableName = 'tbl_danh_muc';
        const checkColumn = 'ten_danh_muc';
        const redirectPath = '/admin/danhmuc';

        helper.checkAndInsertRecord(tableName, { ten_danh_muc: ten_danh_muc, ngay_tao: ngay_tao }, checkColumn, redirectPath, req, res);
    }
    add_mau_sac(req, res) {
        const tableName = 'tbl_mau_sac';
        const tenFieldName = 'ten_mau_sac';
        const redirectPath = 'mau_sac';
        helper.addDanhMuc(tableName, tenFieldName, redirectPath, req, res);
    }
    add_dung_luong(req, res) {
        const tableName = 'tbl_dung_luong';
        const tenFieldName = 'ten_dung_luong';
        const redirectPath = 'dung_luong';
        helper.addDanhMuc(tableName, tenFieldName, redirectPath, req, res);
    }
    delete_mau_sac(req, res) {
        const tableName = 'tbl_mau_sac';
        const tableId = 'id';
        const redirectPath = 'mau_sac';
        helper.deleteRecord(tableName, tableId, redirectPath, req, res);
    }
    delete_danh_muc(req, res) {
        const tableName = 'tbl_danh_muc';
        const tableId = 'id';
        const redirectPath = 'danhmuc';
        helper.deleteRecord(tableName, tableId, redirectPath, req, res);
    }
    delete_dung_luong(req, res) {
        const tableName = 'tbl_dung_luong';
        const tableId = 'id';
        const redirectPath = 'dung_luong';
        helper.deleteRecord(tableName, tableId, redirectPath, req, res);
    }
    search_danh_muc(req, res) {
        const tableName = 'tbl_danh_muc';
        const searchField = 'ten_danh_muc';
        const redirectPath1 = 'product';
        const redirectPath2 = 'danhmucsp';
        const queryParams = req.query.name;

        helper.searchInTable(req, res, tableName, searchField, redirectPath1, redirectPath2, queryParams);
    }
    search_mau_sac(req, res) {
        const tableName = 'tbl_mau_sac';
        const searchField = 'ten_mau_sac';
        const redirectPath1 = 'product';
        const redirectPath2 = 'mau_sac';
        const queryParams = req.query.name;

        helper.searchInTable(req, res, tableName, searchField, redirectPath1, redirectPath2, queryParams);
    }
    search_dung_luong(req, res) {
        const tableName = 'tbl_dung_luong';
        const searchField = 'ten_dung_luong';
        const redirectPath1 = 'product';
        const redirectPath2 = 'dung_luong';
        const queryParams = req.query.name;

        helper.searchInTable(req, res, tableName, searchField, redirectPath1, redirectPath2, queryParams);
    }
}

module.exports = new productController;