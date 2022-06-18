const express = require('express')
const {requireAuth} = require("./auth_handler");

let router = express.Router();

router.get('', requireAuth, (req, res)=>{
    let user = null;
    if (req['session'].user) {
        user = req['session'].user;
    }
    res.render('index', {"user": user})
});

router.all('*', (req, res)=>{
    res.render('404')
});

module.exports = router