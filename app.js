const express = require('express');
const session = require('express-session');
const path = require('path');
const home_router = require('./routers/home_router');
const users_router = require('./routers/user_router');
const employee_router = require('./routers/employees');

const port = process.env.PORT || 3000

const app = express();

app.set('view engine', 'ejs');
app.set('views', './public');
app.use(express.urlencoded({extended: false}));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'hja&*%&^9jh_lgi*adi3&m3^&sa321**(hi43jkl4()*()&)&%$#%$^&*()__+(&%#@!@!~'
}));

app.use((req, res, next) => {
    let err = req.session.error;
    let msg = req.session.success;
    delete req.session.error;
    delete req.session.success;

    res.locals.message = '';

    if(err) res.locals.message = "<p class='msg error'>"+err+"</p>";
    if(msg) res.locals.message = '<p class="msg success">'+msg+'</p>';
    next();
});

let root = path.join(__dirname, './');
let static_dir = path.join(root, 'statics');
app.use('/statics', express.static(static_dir));

app.use('/users', users_router);
app.use('/employees', employee_router);
app.use('', home_router);

app.listen(port, (err)=> {
    if (err) console.log(err);
    console.log("Server running at: http://localhost:8081");
})