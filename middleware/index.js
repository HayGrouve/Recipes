var User = require("../models/user");
var middlewareObj = {};

middlewareObj.isAdmin = function (req, res, next) {
    // is someone logged in
    if (req.isAuthenticated()) {
        User.findById(req.user.id, (err, foundUser) => {
            if (err || !foundUser) {
                req.flash("error", "User not found!");
                res.redirect("/");
            } else {
                if (req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You are not administrator!");
                    res.redirect("/");
                }
            }
        });
    } else {
        req.flash("success", "Please login first!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;