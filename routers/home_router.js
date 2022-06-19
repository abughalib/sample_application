const express = require('express')
const {requireAuth} = require("./auth_handler");
const sqlite = require("sqlite3");

let router = express.Router();

function get_age_data(rows) {
    let ages = []
    for(data of rows){
        ages.push(data['age']);
    }
    return ages;
}

function get_salary_data(rows) {
    let salary = [];
    for (data of rows){
        salary.push(data['salary']);
    }
    return salary;
}

router.get('', requireAuth, (req, res)=>{

    let db = new sqlite.Database('database.sql', (err)=>{
        if (err) throw err;
    });
    db.all(`SELECT * from Employees`, (err, rows)=>{
        if (err) throw err;

        let age_data = get_age_data(rows);
        let salary_data = get_salary_data(rows);

        return res.render('index.ejs', {'age_data': age_data, 'salary_data': salary_data});
    });
});

router.all('*', (req, res)=>{
    res.render('404')
});

module.exports = router