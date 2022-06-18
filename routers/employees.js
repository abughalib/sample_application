const express = require('express')
const { requireAuth } = require("./auth_handler");
const sqlite = require('sqlite3')

let router = express.Router();

function get_employee_data() {
    let db = new sqlite.Database('database.sql', sqlite.OPEN_READWRITE, (err)=>{
        if (err){
            console.log("Error in opening database");
        }
    });

    return new Promise((resolve, reject)=> {
        db.all('SELECT * from employees', (err, rows)=>{
            if (err) console.log(err);
            resolve(rows)
        });
    });
}

router.get('', requireAuth, (req, res)=> {

    get_employee_data().then(rows => {
        res.render('employees', {"data": rows});
    });
});

module.exports = router