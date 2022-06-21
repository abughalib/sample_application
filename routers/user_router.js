const router = require('express').Router();
const auth = require('./auth_handler')

router.get('/login', auth.notAuth, (req, res)=>{
    res.render('login', {'error': ''})
});

router.post('/login', auth.notAuth, (req, res)=>{
    auth.authenticate(req.body.username, req.body.password, (err, user)=>{
        if(user){
            req["session"].regenerate(()=>{
                // Required to fix this thing below
                // We should not store everything in session.
                req["session"].user = user;
                req["session"].success = "Authenticated as "+user.name;

                //later using database and shadow user.
                res.redirect(`/`)
            })
        }else{
            req["session"].error = "Authentication Failed, Check credential";
            console.log("Authentication Failed, Check credential")
            res.render('login', {'error': 'Authentication failed, Check Credentials'})
        }
    })
});

router.get('/register', auth.notAuth, (req, res)=>{
    res.render('register')
});

router.post('/register', auth.notAuth, (req, res)=>{
    auth.registration(req, res, (error)=>{
        console.log(error);
        res.render('register', {error: "Check fields"})
    })
});

router.get('/profile', auth.requireAuth, (req, res)=>{
    res.render('profile', {user: req["session"].user})
});

router.get('/logout', auth.requireAuth, (req, res)=> {
    req.session.destroy();
    res.redirect('/')
});

module.exports = router