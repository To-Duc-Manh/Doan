const connect = require('../../../config/db');
const moment = require('moment');


class khachhangController {

    // [GET] /khachhang
    index(req, res) {
        let sql = "select * from tbl_khach_hang";

        connect.query(sql, (err, data) => {
            res.render('admin/khach_hang/khachhang.ejs', {
                data: data
            });

        });
    }

    add_Khachhang(req, res) {
        const { ho_ten, email, mat_khau, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi } = req.body;

        if (ho_ten && email && mat_khau && ngay_sinh && gioi_tinh && so_dien_thoai && dia_chi) {
            const checkUserQuery = `SELECT * FROM tbl_khach_hang WHERE email = '${email}'`;
            connect.query(checkUserQuery, (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }
                if (result.length > 0) {
                    // A user with that email address already exists
                    const conflictError = 'User credentials already exist.';
                    res.redirect('/admin/khachhang');
                } else {
                    // Create a User

                    const ngay_tao = moment().format('YYYY-MM-DD HH:mm:ss');
                    const newUser = {
                        ho_ten: ho_ten,
                        email: email,
                        mat_khau: mat_khau, // Note: In a production environment, you should hash or encrypt the password
                        ngay_sinh: ngay_sinh,
                        gioi_tinh: gioi_tinh,
                        so_dien_thoai: so_dien_thoai,
                        dia_chi: dia_chi,
                        ngay_tao: ngay_tao
                    };
                    const insertUserQuery = "INSERT INTO tbl_khach_hang SET ?";
                    connect.query(insertUserQuery, newUser, (err, result) => {
                        if (err) {
                            console.log("error: ", err);
                            res.status(500).send("Internal Server Error");
                            return;
                        }
                        console.log("created user: ", { ...newUser });
                        // Handle email verification or any other steps here
                        res.redirect('/admin/khachhang');
                    });
                }
            });
        } else {
            const conflictError = 'User credentials are required.';
            res.redirect('/admin/khachhang');
        }
    };

    edit_Khachhang(req, res) {
        let id = req.params.id;
        console.log(id)
        connect.query(`select * from tbl_khach_hang where id = ${id}`, (err, data) => {
            console.log(data)


            res.render('admin/khach_hang/editKhachhang.ejs', {
                data: data[0]
            })

        })
    }

    update_Khachhang(req, res) {
        let id = req.params.id;

        const { ho_ten, email, mat_khau, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi } = req.body;

        // Create a User
        const insertUserQuery = "UPDATE tbl_khach_hang SET ? where id = ?";
        connect.query(insertUserQuery, [{ ho_ten, email, mat_khau, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi }, id], (err, result) => {

            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/khachhang');
        });
    };

    delete_Khachhang(req, res) {
        let id = req.params.id;

        // Create a User
        const deleteUserQuery = "DELETE FROM tbl_khach_hang WHERE id = ?";
        connect.query(deleteUserQuery, [id], (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/khachhang');
        });
    };

    search(req, res) {
        let name = req.query.name;
        let table_search = "tbl_khach_hang";

        let sql_search;
        let params = [];

        if (name) {
            sql_search = "SELECT * FROM " + table_search + " WHERE ho_ten LIKE ?";
            params = ['%' + name + '%'];
        } else {
            sql_search = "SELECT * FROM " + table_search;
        }

        connect.query(sql_search, params, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.render('admin/khach_hang/khachhang.ejs', {
                data: data
            });
        });
    }


}
module.exports = new khachhangController(); 