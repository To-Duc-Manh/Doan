const homeUserRoute = require('./homeuser');
const authRoute = require('./auth');
const adminRoute = require('./admin');
function route(app) {

    app.use('/auth', authRoute);
    app.use('/admin', adminRoute)
    app.use('/', homeUserRoute);
}

module.exports = route;