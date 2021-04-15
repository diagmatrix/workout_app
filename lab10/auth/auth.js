const passport = require('passport');
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

exports.init = function(app) {
    // Password setup
    passport.use(new Strategy(
        function(username,password,cb) {
            userModel.lookup(username,function(err,user) {
                if (err) {
                    console.log("Error looking for user",err);
                    return cb(err);
                }
                if (!user) {
                    console.log("user ",username," not found");
                    return cb(null,false);
                }
                // Password comparing
                bcrypt.compare(password,user.password,function(err,result) {
                    if (result) {
                        console.log("User authenticated ",user);
                        cb(null,user);
                    } else {
                        console.log("Passwords don't match");
                        cb(null,false);
                    }
                });
            });
        }
    ));
    // Session handling
    passport.serializeUser(function(err,cb) {
        cb(null,user.user);
    });
    passport.deserializeUser(function(err,cb) {
        userModel.lookup(id, function(err,user) {
            if (err) {
                return cb(err);
            }
            cb(null,user);
        });
    });
}

exports.authorize = function(redirect) {
    return passport.authenticate("local", {failureRedirect: redirect});
}