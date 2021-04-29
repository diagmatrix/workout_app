const passport = require('passport');
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userDB = require("../models/manager");

exports.setup = function(app) {
    // Password strategy setup
    passport.use(new Strategy(function(username,password,cb) {
        userDB.check_user(username,function(err,user) {
            if (err) {
                console.log("ERROR: internal error looking for user:",username);
                return cb(err);
            } else if (!user) {
                console.log("ERROR: User",username,"not found");
                return cb(null,false);
            } else {
                bcrypt.compare(password,user.password,function(err,same) {
                    if (same) {
                        console.log("User",username,"authenticated")
                        cb(null,user);
                    } else {
                        console.log("ERROR: Passwords don't match");
                        cb(null,false);
                    }
                });
            }
        });
    }));
    // Session handling
    passport.serializeUser(function(user,cb) {
        console.log("Serializing:",user.username);
        cb(null,user.username);
    });
    passport.deserializeUser(function(id,cb) {
        userDB.check_user(id, function(err,user) {
            if (err) {
                console.log("ERROR: Internal error deserializing user");
                return cb(err);
            }
            console.log("User",user.username,"deserialized");
            return cb(null,user);
        });
    });
}
exports.authorize = function(redirect) {
    return passport.authenticate("local", {failureRedirect: redirect});
}