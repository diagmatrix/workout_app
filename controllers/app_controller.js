const { response } = require("express");
const training_plan = require("../models/training_plan");
const manager = require("../models/manager");
const user_calendar = require("../models/user_calendar");
const { this_monday, change_week } = require("../models/date_management");

var calendarDB = new user_calendar("Testuser");
const training_plan_db = new training_plan();
var week = this_monday();

// ------------------------------------------------------------
// LANDING PAGE
exports.landing_page = function(req,res) {
    res.render("landing_page", {
        "title": "Workout app"
    })
}

// ------------------------------------------------------------
// USER FUNCTIONS
exports.register = function(req,res) {
    // For testing purposes MUST DELETE LATER
    // manager.delete_all();
    res.render("user/register");
}
exports.post_register = function(req,res) {
    const user = req.body.username;
    const pass = req.body.password;

    console.log("register user with name: ", user, " and password: ",  pass);
    if (!user || !pass) {
        console.log("Error: no user or no password");
        res.send(401, 'no user or no password'); 
        return;
    }
    manager.check_user(user,function(err,name) {
        if (name) {
            console.log("Error: User exists");
            res.render("user/register", { "user-name-error": true});
        } else {
            console.log("Creating user");
            manager.add_user(user,pass);
            res.redirect("/");
        }
    })
}
exports.login = function(req,res) {
    res.render("user/login",{"title": "Login"});
}
exports.post_login = function(req,res) {
    console.log("User ",req.user.username,"logged in");
    calendarDB = new user_calendar(req.user.username);
    var redirect_url = "/" + req.user.username;
    res.redirect(redirect_url);
}
exports.userpage = function(req,res) {
    console.log("Profile page of",req.params.profile);
    // URL creation depending of the user logged in
    week = this_monday();
    console.log("This week is:",week);
    calendarDB.get_week(week).then((list) => {
        var plan = (list[0].length+list[1].length+list[2].length)>=3;
        if (plan) {
            // If there is a plan
            res.render("profile",{
                "title": req.params.profile,
                "cardio": list[2],
                "gym": list[1],
                "sport": list[0],
                "week": week,
                "name": req.params.profile,
                "exist": true
            });
        } else {
            // If there is no plan
            res.render("profile",{
                "title": req.params.profile,
                "week": week,
                "name": req.params.profile,
                "exist": false
            });
        }
        console.log("Promise resolved");
    }).catch((err) => {
        console.log("Promise rejected");
    });
}
exports.logout = function(req, res) {
    console.log("Logging out...");
    req.logout();
    res.redirect("/");
};

// ------------------------------------------------------------
// SHARING PLAN FUNCTIONS
// TODO
exports.shared_plan = function(req,res) {
    console.log("Shared plan id:",req.params.id," of user:",req.params.profile);
}

// ------------------------------------------------------------
// CALENDAR FUNCTIONS
exports.calendar = function(req,res) {
    calendarDB.get_week(week).then((list) => {
        var plan = (list[0].length+list[1].length+list[2].length)>=3;
        if (plan) {
            // If there is a plan
            res.render("calendar",{
                "title": "Calendar",
                "cardio": list[2],
                "gym": list[1],
                "sport": list[0],
                "week": week,
                "name": req.params.profile,
                "exist": true
            });
        } else {
            // If there is no plan
            res.render("calendar",{
                "title": "Calendar",
                "week": week,
                "name": req.params.profile,
                "exist": false
            });
        }
        console.log("Promise resolved");
    }).catch((err) => {
        console.log("Promise rejected");
    });
}
exports.new_calendar_week = function(req,res) {
    console.log("Action:",req.body.week_change);
    week = change_week(week,req.body.week_change);
    console.log("New week:",week);
    var redirect_url = "/" + req.user.username + "/calendar";
    res.redirect(redirect_url);
}

// ------------------------------------------------------------
// TRAINING PLAN FUNCTIONS
exports.show_plan = function(req,res) {
    console.log(req.user.username);
    
    training_plan_db.get_list().then((list) => {
        res.render("training_plan/training_plan",{
            "title": "Training plan",
            "cardio": list[2],
            "gym": list[1],
            "sport": list[0]
        });
        console.log("Promise resolved.",list);
    }).catch((err) => {
        console.log("Promise rejected:",err);
    });
}
exports.new_exercise = function(req,res) {
    var type = req.params.type;
    console.log("New",type);

    if (type=="cardio") {
        res.render("training_plan/new_cardio", {
            "title": "Add exercise"
        });
    } else if (type=="strength") {
        res.render("training_plan/new_strength", {
            "title": "Add exercise"
        });
    } else if (type=="sport") {
        res.render("training_plan/new_sport", {
            "title": "Add exercise"
        });
    } else {
        console.log("Error: No type ",type);
    }
}
exports.post_new_exercise = function(req,res) {
    var type = req.params.type;
    console.log("Adding one",type);
    if (type=="cardio") {
        training_plan_db.add_cardio(req.body.name,req.body.distance);
    } else if (type=="strength") {
        training_plan_db.add_strength(req.body.name,req.body.weight,req.body.repetitions);
    } else if (type=="sport") {
        training_plan_db.add_sport(req.body.name,req.body.duration);
    } else {
        console.log("Error: No type ",type);
    }
    var redirect_url = "/" + req.user.username + "/plan";
    res.redirect(redirect_url);
}
exports.complete_exercise = function(req,res) {
    training_plan_db.complete_exercise(req.params.type,req.params.id);
    var redirect_url = "/" + req.user.username + "/plan";
    res.redirect(redirect_url);
}
exports.modify_exercise = function(req,res) {
    var type = req.params.type;

    training_plan_db.get_exercise(type,req.params.id).then((data) => {
        var exercise = data[0]
        switch(type) {
            case "cardio":
                res.render("training_plan/modify_cardio", {
                    "title": "Modify exercise "+ exercise.name,
                    "name": exercise.name,
                    "distance": exercise.distance,
                    "id": exercise._id
                });
                break;
            case "strength":
                res.render("training_plan/modify_strength", {
                    "title": "Modify exercise "+ exercise.name,
                    "name": exercise.name,
                    "weight": exercise.weight,
                    "repetitions": exercise.repetitions,
                    "id": exercise._id
                });
                break;
            case "sport":
                res.render("training_plan/modify_sport", {
                    "title": "Modify exercise "+ exercise.name,
                    "name": exercise.name,
                    "duration": exercise.duration,
                    "id": exercise._id
                });
                break;
            default:
                console.log("Error modifying exercise")
                break;
        }
    })
}
exports.post_modify_exercise = function(req,res) {
    var type = req.params.type;
    console.log("Modifying exercise: ",req.body.id);
    if (type=="cardio") {
        training_plan_db.modify_cardio(req.body.id,req.body.distance);
    } else if (type=="strength") {
        training_plan_db.modify_strength(req.body.id,[req.body.weight,req.body.repetitions]);
    } else if (type=="sport") {
        training_plan_db.modify_sport(req.body.id,req.body.duration);
    } else {
        console.log("Error: No type ",type);
    }

    var redirect_url = "/" + req.user.username + "/plan";
    res.redirect(redirect_url);
}
exports.delete_exercise = function(req,res) {
    training_plan_db.delete_exercise(req.params.type,req.params.id);
    var redirect_url = "/" + req.user.username + "/plan";
    res.redirect(redirect_url);
}