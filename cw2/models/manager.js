const nedb = require("nedb");
const bcrypt = require("bcrypt");
const { resolve } = require("path");
const { rejects } = require("assert");
const salt_rounds = 10

// Manager class
class manager {
    static #users = new nedb({filename: "./db/users",autoload: true});
    static #plans = new nedb({filename: "./db/shared_plans",autoload: true});

    // Create a new user
    static add_user(username,password) {
        bcrypt.hash(password,salt_rounds).then((hash) => {
            var new_user = {
                username: username,
                password: hash
            };
            console.log("New user: ",new_user);
            this.#users.insert(new_user,function(err) {
                if(err) {
                    console.log("Cannot insert user");
                    return false;
                } else {
                    return true;
                }
            });
        });
    }
    // Check if a user exists
    // DIFFERENT FROM DESIGN
    static check_user(username, cb) {
        console.log("Looking up user: ",username);
        this.#users.findOne({username: username},function(err,entry) {
            if (err || !entry) {
                console.log("Error or no user found");
                return cb(null, null);
            } else {
                console.log("User is: ",entry);
                return cb(null,entry);
            }
        });
    }
    // Gets a plan
    static get_plan(id) {
        return new Promise((resolve,reject) => {
            this.#plans.find({_id: id},function(err,entry) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entry);
                    console.log("Plan ",id," found!");
                }
            })
        })
    }
    // Adds a plan
    static add_plan(plan,user) {
        var added_plan = plan;
        added_plan["username"] = user;
        this.#plans.insert(added_plan,function(err) {
            if(err) {
                console.log("Cannot insert plan");
                return false;
            } else {
                console.log("Added plan: ",added_plan);
                return true;
            }
        });
    }
}

module.exports = manager