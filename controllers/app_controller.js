const { response } = require("express");
const training_plan = require("../models/training_plan");
const manager = require("../models/manager");
const user_calendar = require("../models/user_calendar");
const { this_monday, change_week } = require("../models/date_management");

var calendarDB = new user_calendar("Testuser");
const current_plan = new training_plan();
var week = this_monday();
var empty_plan = true;

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
    page_url = req.url;
    calendarDB.get_week(week).then((plan) => {
        if (!plan) { // If there is no plan
            console.log("No plan for week...");
            res.render("profile",{
                "title": req.params.profile,
                "week": week,
                "name": req.params.profile,
                "exist": false
            });
        } else { // If there is a plan
            console.log(plan);
            current_plan.create_from_list(plan[0],plan[1],plan[2]);
            current_plan.get_list().then((list) => {        
                res.render("profile",{
                    "title": req.params.profile,
                    "cardio": list[2],
                    "gym": list[1],
                    "sport": list[0],
                    "week": week,
                    "name": req.params.profile,
                    "exist": true,
                    "enough": (list[0].length+list[1].length+list[2].length)>3,
                    "parent_url": page_url
                });
                console.log("Promise resolved");
            }).catch((err) => {
                console.log("Promise rejected:",err);
            });
        }
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
    page_url = req.url;
    calendarDB.get_week(week).then((plan) => {
        current_plan.create_from_list(plan[0],plan[1],plan[2]);
        if (!plan) { // If there is no plan
            res.render("calendar",{
                "title": req.params.profile,
                "week": week,
                "name": req.params.profile,
                "exist": false
            });
        } else { // If there is a plan
            current_plan.get_list().then((list) => {        
                res.render("calendar",{
                    "title": req.params.profile,
                    "cardio": list[2],
                    "gym": list[1],
                    "sport": list[0],
                    "week": week,
                    "name": req.params.profile,
                    "exist": true,
                    "enough": (list[0].length+list[1].length+list[2].length)>3,
                    "parent_url": page_url
                });
            });
        }
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
// TRAINING PLAN CREATION FUNCTIONS
exports.new_plan = function(req,res) {
    week = req.params.week;
    page_url = req.url;
    can_post = (!empty_plan & current_plan.get_num()>=3);
    if (empty_plan) {
        console.log("Starting new training plan...");
        current_plan.clear();
        empty_plan = false;
    }
    current_plan.get_list().then((list) => {
        res.render("training_plan/new_plan", {
            "title": "New plan",
            "week": week,
            "cardio": list[2],
            "gym": list[1],
            "sport": list[0],
            "parent_url": page_url,
            "enough": can_post
        });
        console.log("Promise resolved.",list);
    }).catch((err) => {
        console.log("Promise rejected:",err);
    });
}
exports.post_new_plan = function(req,res) {
    console.log("Creating plan for week:",req.body.plan_week);
    calendarDB.modify_week(req.body.plan_week,current_plan);
    empty_plan = true;
    redirect_url = "/" + req.user.username + "/calendar";
    res.redirect(redirect_url);
}

// ------------------------------------------------------------
// TRAINING PLAN FUNCTIONS
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
        current_plan.add_cardio(req.body.name,req.body.distance);
    } else if (type=="strength") {
        current_plan.add_strength(req.body.name,req.body.weight,req.body.repetitions);
    } else if (type=="sport") {
        current_plan.add_sport(req.body.name,req.body.duration);
    } else {
        console.log("Error: No type ",type);
    }
    redirect_url = req.url.replace(/\/new-.*/,"");
    console.log("Redirecting to",redirect_url);
    res.redirect(redirect_url);
}

// ------------------------------------------------------------
// TRAINING PLAN FUNCTIONS v1
/*
exports.show_plan = function(req,res) {
    console.log(req.user.username);
    
    current_plan.get_list().then((list) => {
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
        current_plan.add_cardio(req.body.name,req.body.distance);
    } else if (type=="strength") {
        current_plan.add_strength(req.body.name,req.body.weight,req.body.repetitions);
    } else if (type=="sport") {
        current_plan.add_sport(req.body.name,req.body.duration);
    } else {
        console.log("Error: No type ",type);
    }
    var redirect_url = "/" + req.user.username + "/plan";
    res.redirect(redirect_url);
}
exports.complete_exercise = function(req,res) {
    current_plan.complete_exercise(req.params.type,req.params.id);
    var redirect_url = "/" + req.user.username + "/plan";
    res.redirect(redirect_url);
}
exports.modify_exercise = function(req,res) {
    var type = req.params.type;

    current_plan.get_exercise(type,req.params.id).then((data) => {
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
        current_plan.modify_cardio(req.body.id,req.body.distance);
    } else if (type=="strength") {
        current_plan.modify_strength(req.body.id,[req.body.weight,req.body.repetitions]);
    } else if (type=="sport") {
        current_plan.modify_sport(req.body.id,req.body.duration);
    } else {
        console.log("Error: No type ",type);
    }

    var redirect_url = "/" + req.user.username + "/plan";
    res.redirect(redirect_url);
}
exports.delete_exercise = function(req,res) {
    current_plan.delete_exercise(req.params.type,req.params.id);
    var redirect_url = "/" + req.user.username + "/plan";
    res.redirect(redirect_url);
}
*/