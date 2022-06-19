const hash = require('pbkdf2-password')()
const sqlite = require('sqlite3')

/*
    Registration function takes request, response and a call back function.
    password is hashed then inserted.
    Redirect to 'profile' on success.
*/

salt = process.env.SALT

function registration(req, res, cbf) {
    let db = new sqlite.Database('database.sql', sqlite.OPEN_READWRITE, (err)=>{
        if (err){
            console.log("Error in opening database");
        }
    });
    hash({ password: req.body.password1}, (err, pass, salt, hash)=> {
        if (err) {
            cbf(new Error("Cannot hash Password"));
        }
        db.all(`INSERT INTO Users(name, email, password, salt)
        VALUES('${req.body.name}', '${req.body.email}', '${hash}', '${salt}')`);
        if (err) throw err;
        console.log("Registered")
    });
    res.redirect('/users/profile')
}

/*
    Authenticate function take email, password and a call back function
    1. Getting the user with email from Database
    2. Calculating hash for the password
    3. On success returns User's Name;
*/

function authenticate(email, password, cbf) {
    let db = new sqlite.Database('database.sql', (err)=>{
       if (err) throw err;
    });
    db.all(`SELECT * from users WHERE email='${email}'`, (err, rows)=>{
        if(err) return cbf(new Error("User not found!"));
        hash({password: password, salt: rows[0].salt}, (err, pass, salt, hash)=>{
            if(err) throw err;
            if(hash === rows[0].password) return cbf(null, rows[0])
            cbf(new Error("Invalid password!"))
        });
    });
}

// Middleware to allow authenticated users to visit restricted page
function require_auth(req, res, next) {
    if (req.session.user) {
        next()
    }else {
        req.session.error = 'Access Denied';
        res.redirect('/users/login')
    }
}


// Middleware to allow unauthenticated user
function not_auth(req, res, next) {
    if (req.session.user) {
        req.session.error = 'Logged in already';
        res.redirect('/users/profile')
    }else {
        next()
    }
}

exports.registration = registration
exports.authenticate = authenticate
exports.requireAuth = require_auth
exports.notAuth = not_auth