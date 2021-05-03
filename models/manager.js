const nedb = require("nedb");
const bcrypt = require("bcrypt");
const { remove_ids } = require("./auxiliaries")
const salt_rounds = 10

// Manager class
class manager {
    static #users = new nedb({filename: "./db/users.db",autoload: true});
    static #plans = new nedb({filename: "./db/shared_plans.db",autoload: true});

    // Create a new user
    static add_user(username,password) {
        bcrypt.hash(password,salt_rounds).then((hash) => {
            var new_user = {
                username: username,
                password: hash
            };
            console.log("New user:",new_user.username);
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
        console.log("Looking up user");
        this.#users.findOne({username: username},function(err,entry) {
            if (err || !entry) {
                console.log("Error or no user found");
                return cb(null, null);
            } else {
                console.log("User found");
                return cb(null,entry);
            }
        });
    }
    // Gets a plan
    static get_plan(week,user) {
        return new Promise((resolve,reject) => {
            this.#plans.find({username: user, week: week},function(err,entry) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entry);
                }
            })
        });
    }
    // Returns plan with an id
    static get_plan_id(id) {
        return new Promise((resolve,reject) => {
            this.#plans.find({_id: id},function(err,entry) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entry);
                }
            })
        });
    }
    // Adds a plan
    static add_plan(week,user,plan) {
        remove_ids(plan);
        var added_plan = {
            plan: plan,
            username: user,
            week: week
        }
        this.#plans.insert(added_plan,function(err,doc) {
            if (err) {
                console.log("Cannot insert plan");
            }
        });
    }

    // Deletes all users (for testing purposes only)
    static delete_all() {
        this.#users.remove({},{},function(err,num) {
            if (!err) {
                console.log("Deleted",num,"users");
            }
        })
    }
}

module.exports = manager