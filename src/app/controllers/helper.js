const connect = require('../../config/db');
const moment = require('moment');
const paginate = require('express-paginate');

function deleteRecord(tableName, tableId, redirectPath, req, res) {
    let id = req.params.id;

    const deleteQuery = `DELETE FROM ${tableName} WHERE ${tableId} = ?`;
    connect.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.redirect(`/admin/${redirectPath}`);
    });
}

function deleteRecord_user(tableName, tableId, redirectPath, req, res) {
    let id = req.params.id;

    const deleteQuery = `DELETE FROM ${tableName} WHERE ${tableId} = ?`;
    connect.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.redirect(`/${redirectPath}`);
    });
}

function addDanhMuc(tableName, tenFieldName, redirectPath, req, res) {
    const ten = req.body[tenFieldName];

    if (ten) {
        // Kiểm tra xem giá trị đã tồn tại trong bảng hay chưa
        const checkQuery = `SELECT COUNT(*) AS count FROM ${tableName} WHERE ${tenFieldName} = ?`;
        connect.query(checkQuery, [ten], (checkErr, checkResult) => {
            if (checkErr) {
                console.log("error: ", checkErr);
                res.status(500).send("Internal Server Error");
                return;
            }

            const rowCount = checkResult[0].count;

            if (rowCount > 0) {
                // Giá trị đã tồn tại trong bảng
                const conflictError = `'${ten}' đã tồn tại`;
                res.status(409).send(conflictError);
            } else {
                // Giá trị không tồn tại, thêm vào bảng
                const newDanhMuc = {
                    [tenFieldName]: ten,
                    // ngay_tao: ngayTao
                };

                const insertQuery = `INSERT INTO ${tableName} SET ?`;
                connect.query(insertQuery, newDanhMuc, (insertErr, insertResult) => {
                    if (insertErr) {
                        console.log("error: ", insertErr);
                        res.status(500).send("Internal Server Error");
                        return;
                    }
                    res.redirect(`/admin/${redirectPath}`);
                });
            }
        });
    } else {
        const conflictError = 'Product information is required.';
        res.status(400).send(conflictError);
    }
}

function searchInTable(req, res, tableName, searchField, redirectPath1, redirectPath2, queryParams) {
    let sqlSearch;
    let params = [];

    if (queryParams) {
        sqlSearch = `SELECT * FROM ${tableName} WHERE ${searchField} LIKE ?`;
        params = ['%' + queryParams + '%'];
    } else {
        sqlSearch = `SELECT * FROM ${tableName}`;
    }

    connect.query(sqlSearch, params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(params);

        res.render(`admin/${redirectPath1}/${redirectPath2}.ejs`, {
            data: data
        });
    });
}





function checkAndInsertRecord(tableName, recordData, checkColumn, redirectPath, req, res) {
    const { [checkColumn]: checkValue, ...otherData } = recordData;

    if (!checkValue) {
        return res.redirect(redirectPath);
    }

    const checkQuery = `SELECT * FROM ${tableName} WHERE ${checkColumn} = '${checkValue}'`;
    connect.query(checkQuery, (err, result) => {
        if (err) {
            console.error("Error checking record:", err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.length > 0) {
            return res.redirect(redirectPath);
        }

        const insertQuery = `INSERT INTO ${tableName} SET ?`;
        connect.query(insertQuery, { [checkColumn]: checkValue, ...otherData }, (err, result) => {
            if (err) {
                console.error("Error inserting record:", err);
                return res.status(500).send("Internal Server Error");
            }

            console.log(`Created record in ${tableName}:`, { ...recordData });
            res.redirect(redirectPath);
        });
    });
}

module.exports = { deleteRecord, addDanhMuc, searchInTable, checkAndInsertRecord, deleteRecord_user };
