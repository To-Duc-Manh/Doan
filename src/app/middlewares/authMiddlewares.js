exports.loggedin = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user
        next();
    } else {
        res.redirect('/auth/loginAdmin');
    }
}

exports.loggedinUser = (req, res, next) => {
    if (req.session.loggedinUser) {
        res.locals.user = req.session.user
        next();
    } else {
        res.redirect('/auth/loginUser');
    }
}

exports.isAuth = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user
        res.redirect('/user/home');
    } else {
        next();
    }
}

