const connect = require('../../../config/db');
const moment = require('moment');


class nhanvienController {

    // [GET] /nhanvien
    index(req, res) {
        let sql = "select * from tbl_nhan_vien";
        connect.query(sql, (err, data) => {
            res.render('admin/nhan_vien/nhanVien.ejs', {
                data: data
            });

        });
    }

    add_nhanvien(req, res) {
        const { ten_nhan_vien, email, so_dien_thoai, dia_chi, mat_khau, content } = req.body;

        if (ten_nhan_vien && email && so_dien_thoai && dia_chi && mat_khau) {
            const checkUserQuery = `SELECT * FROM tbl_nhan_vien WHERE email = '${email}'`;
            connect.query(checkUserQuery, (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }
                if (result.length > 0) {
                    // A user with that email address already exists
                    const conflictError = 'User credentials already exist.';
                    res.redirect('/admin/nhanvien');
                } else {
                    // Create a User

                    const ngay_tao = moment().format('YYYY-MM-DD HH:mm:ss');
                    const newUser = {
                        ten_nhan_vien: ten_nhan_vien,
                        email: email,
                        // Note: In a production environment, you should hash or encrypt the password
                        so_dien_thoai: so_dien_thoai,
                        dia_chi: dia_chi,
                        mat_khau: mat_khau,
                        // content: content,
                        ngay_tao: ngay_tao
                    };
                    const insertUserQuery = "INSERT INTO tbl_nhan_vien SET ?";
                    connect.query(insertUserQuery, newUser, (err, result) => {
                        if (err) {
                            console.log("error: ", err);
                            res.status(500).send("Internal Server Error");
                            return;
                        }
                        console.log("created user: ", { ...newUser });
                        // Handle email verification or any other steps here
                        res.redirect('/admin/nhanvien');
                    });
                }
            });
        } else {
            const conflictError = 'User credentials are required.';
            res.redirect('/admin/nhanvien');
        }
    };

    edit_nhanvien(req, res) {
        let id = req.params.id;
        console.log(id)
        connect.query(`select * from tbl_nhan_vien where id = ${id}`, (err, data) => {
            console.log(data)


            res.render('admin/nhan_vien/editNhanvien.ejs', {
                data: data[0]
            })

        })
    }

    update_nhanvien(req, res) {
        let id = req.params.id;

        const { ten_nhan_vien, email, mat_khau, so_dien_thoai, dia_chi, content } = req.body;

        // Create a User
        const insertUserQuery = "UPDATE tbl_nhan_vien SET ? where id = ?";
        connect.query(insertUserQuery, [{ ten_nhan_vien, content, email, so_dien_thoai, dia_chi, mat_khau }, id], (err, result) => {

            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/nhanvien');
        });
    };

    delete_nhanvien(req, res) {
        let id = req.params.id;

        // Create a User
        const deleteUserQuery = "DELETE FROM tbl_nhan_vien WHERE id = ?";
        connect.query(deleteUserQuery, [id], (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect('/admin/nhanvien');
        });
    };

    search(req, res) {
        let name = req.query.name;
        let table_search = "tbl_nhan_vien";

        let sql_search;
        let params = [];

        if (name) {
            sql_search = "SELECT * FROM " + table_search + " WHERE ten_nhan_vien LIKE ?";
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

            res.render('admin/nhan_vien/nhanVien.ejs', {
                data: data
            });
        });
    }

}
module.exports = new nhanvienController(); 