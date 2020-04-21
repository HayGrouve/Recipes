const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    mongoose = require('mongoose'),
    flash = require("connect-flash"),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    Recipe = require('./models/recipe'),
    User = require('./models/user'),
    middleware = require('./middleware/index');

const url = process.env.DATABASEURL || 'mongodb://localhost/recipes';
const port = process.env.PORT || 3000;
// MONGO CONFIG
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log("Database connected successfully!");
});

//APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(flash());

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "note",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//INDEX ROUTE
app.get('/', (req, res) => {
    Recipe.find({}, (err, foundRecipe) => {
        if (err || !foundRecipe) {
            req.flash("error", "Something went wrong!");
        } else {
            res.render('index', { recipes: foundRecipe });
        }
    });
});

//CREATE RECIPE
app.post('/recipe', middleware.isAdmin, (req, res) => {
    Recipe.create(req.body.recipe, (err, createdRecipe) => {
        if (err || !createdRecipe) {
            req.flash("error", "Access Denied!");
            res.redirect('/');
        } else {
            req.flash("success", "Recipe Added!");
            res.redirect('/')
        }
    });
});

//SHOW RECEPE
app.get('/recipe/:id', (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err || !foundRecipe) {
            req.flash("error", "Recipe not found!");
            res.redirect('back');
        } else {
            res.render('show', { recipe: foundRecipe });
        }
    });
});

//EDIT RECIPE
app.get('/recipe/:id/edit', middleware.isAdmin, (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err || !foundRecipe) {
            req.flash("error", "Access Denied!");
            res.redirect('back');
        } else {
            res.render('edit', { recipe: foundRecipe });
        }
    });
});

//UPDATE RECIPE
app.post('/recipe/update/:id', middleware.isAdmin, (req, res) => {
    Recipe.updateOne({ _id: req.params.id }, req.body.recipe, (err, updatedRecipe) => {
        if (err || !updatedRecipe) {
            req.flash("error", "Access Denied!");
            res.redirect('back');
        } else {
            req.flash("success", "Recipe Edited!");
            res.redirect(`/recipe/${req.params.id}`);
        }
    });
});

//DELETE RECIPE
app.post('/delete', middleware.isAdmin, (req, res) => {
    Recipe.deleteOne({ _id: req.body.id }, (err, deleted) => {
        if (err || !deleted) {
            req.flash("error", "Access Denied!");
            res.redirect('back');
        } else {
            req.flash("error", "Recipe Deleted!");
            res.redirect('/');
        }
    })
});

//SIGN IN
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    if (req.body.password.length < 6) {
        req.flash('error', 'Password must be atleast 6 characters long!');
        res.redirect('/register');
    } else {
        User.register(new User({
            username: req.body.username
        }), req.body.password, (err, user) => {
            if (err || !user) {
                req.flash('error', 'Username already taken');
                res.redirect('/register');
            }
            passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            });
        });
    }
});

//LOGIN
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureFlash: 'Incorect username or password',
    failureRedirect: '/login'
}), (req, res) => {
});

//LOGOUT
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});