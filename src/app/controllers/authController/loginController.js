const connect = require('../../../config/db');
const moment = require('moment');


class LoginController {
    loginAdmin(req, res) {

        let email = req.body.email;
        let password = req.body.password;

        if (email && password) {
            connect.query(`SELECT * from tbl_nhan_vien WHERE email = '${email}'`, (err, result) => {
                if (err) {
                    console.error(err);
                    res.render('auth/loginAdmin.ejs');
                    return;
                }

                if (result.length) {
                    const user = result[0];
                    // So sánh mật khẩu trực tiếp 
                    if (password === user.mat_khau) {
                        req.session.loggedin = true;
                        req.session.user = user;
                        res.redirect('/admin');
                    } else {
           
                        const conflictError = 'User credentials are not valid.';
                        res.render('auth/loginAdmin.ejs', { email, password, conflictError });
                    }
                } else {
                    
                    res.redirect('/auth/loginAdmin');
                }
            });
        } else {

            const conflictError = 'User credentials are not valid.';
            res.render('auth/loginAdmin.ejs', { email, password, conflictError });
        }
    };

    loginUser(req, res) {

        let email = req.body.email;
        let password = req.body.password;

        if (email && password) {
            connect.query(`SELECT * from tbl_khach_hang WHERE email = '${email}'`, (err, result) => {
                if (err) {
                    console.error(err);
                    res.render('auth/loginUser.ejs');
                    return;
                }

                if (result.length) {
                    const user = result[0];
   
                    if (password === user.mat_khau) {
                        req.session.loggedinUser = true;
                        req.session.user = user;
                        res.redirect('/');
                    } else {

                        const conflictError = 'User credentials are not valid.';
                        res.render('auth/loginUser.ejs', { email, password, conflictError });
                    }
                } else {

                    res.redirect('/auth/loginUser');
                }
            });
        } else {

            const conflictError = 'User credentials are not valid.';
            res.render('auth/loginUser', { email, password, conflictError });
        }
    };

    logoutAdmin(req, res) {
        req.session.destroy((err) => {
            if (err) res.redirect('/500');
            res.redirect('/auth/loginAdmin');
        })
    }

    logoutUser(req, res) {
        req.session.destroy((err) => {
            if (err) res.redirect('/500');
            res.redirect('/');
        })
    }

    register(req, res) {
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
                    res.render('auth/registerUser.ejs', { ho_ten, email, mat_khau, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, conflictError });
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
                        res.redirect('/auth/loginUser');
                    });
                }
            });
        } else {
            const conflictError = 'User credentials are required.';
            res.render('auth/registerUser.ejs', { ho_ten, email, mat_khau, ngay_sinh, gioi_tinh, so_dien_thoai, dia_chi, conflictError });
        }
    };


}

module.exports = new LoginController();



