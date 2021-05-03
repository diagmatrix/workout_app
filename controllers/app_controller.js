const { response } = require("express");
const training_plan = require("../models/training_plan");
const manager = require("../models/manager");
const user_calendar = require("../models/user_calendar");
const achievements = require("../models/achievements");
const { this_monday, change_week, create_chart } = require("../models/auxiliaries");

// ------------------------------------------------------------
// GLOBAL VARIABLES
var calendarDB = new user_calendar("Testuser");
var current_plan = new training_plan();
var week = this_monday();
var empty_plan = true;
var creating_plan = false;
var history = new achievements();
var current_exercise = "Walking";

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
        // If there is a plan
        current_plan = new training_plan(plan[0].plan[0],plan[0].plan[1],plan[0].plan[2]);
        current_plan.get_list().then((list) => {     
            res.render("user/profile",{
                "title": req.params.profile,
                "cardio": list[0],
                "gym": list[1],
                "sport": list[2],
                "week": week,
                "name": req.params.profile,
                "exist": true,
                "enough": (list[0].length+list[1].length+list[2].length)>3,
                "parent_url": page_url
            });
        }).catch((err) => {
            console.log("Promise rejected:",err);
        });
    }).catch((err) => {
        console.log("No plan for week...",err);
            res.render("profile",{
                "title": req.params.profile,
                "week": week,
                "name": req.params.profile,
                "exist": false
            });
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
exports.share_plan = function(req,res) {
    manager.get_plan(week,req.user.username).then((entry) => {
        // Plan has been shared
        res.render("user/shared", {
            "title": "Share link",
            "url_link": "/shared-" + entry[0]._id,
            "user": req.user.username
        });
    }).catch((err) => {
        // If the plan has not been shared before
        console.log("Plan not shared before");
        current_plan.get_list().then((list) => {
            manager.add_plan(week,req.user.username,list);
            manager.get_plan(week,req.user.username).then((entry) => {
                res.render("user/shared", {
                    "title": "Share link",
                    "url_link": "/shared-" + entry[0]._id,
                    "user": req.user.username
                });
            });
        });
    });
}
exports.show_shared_plan = function(req,res) {
    manager.get_plan_id(req.params.id).then((entry) => {
        res.render("training_plan/shared_plan", {
            "title": "Shared plan",
            "user": entry[0].username,
            "week": entry[0].week,
            "cardio": entry[0].plan[0],
            "gym": entry[0].plan[1],
            "sport": entry[0].plan[2]
        });
    }).catch((err) => {    
        res.type("text/plain");     
        res.send("Not found:"+err); 
    });
}

// ------------------------------------------------------------
// CALENDAR FUNCTIONS
exports.calendar = function(req,res) {
    page_url = req.url;
    calendarDB.get_week(week).then((plan) => {
        current_plan = new training_plan(plan[0].plan[0],plan[0].plan[1],plan[0].plan[2]);
        current_plan.get_list().then((list) => {        
            res.render("user/calendar",{
                "title": req.params.profile,
                "cardio": list[0],
                "gym": list[1],
                "sport": list[2],
                "week": week,
                "name": req.params.profile,
                "exist": true,
                "enough": (list[0].length+list[1].length+list[2].length)>3,
                "parent_url": page_url
            });
        }).catch((err) => {
            console.log("Promise rejected:",err);
        });
    }).catch((err) => {
        console.log("Week unplanned");
        res.render("user/calendar",{
            "title": req.params.profile,
            "week": week,
            "name": req.params.profile,
            "exist": false
        });
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
// RECORD FUNCTIONS
exports.stats = function(req,res) {
    calendarDB.get_calendar().then((list) => {
        history = new achievements(list);
        history.get_progress(current_exercise).then((exercise) =>{
            res.render("stats", {
                "title": req.params.profile + "'s stats",
                "name": req.params.profile,
                "exercise": current_exercise,
                "progress": create_chart(exercise[0].progress)
            });
        });
    });
}
exports.change_exercise_stats = function(req,res) {
    current_exercise = req.body.change_exercise;
    redirect_url = "/" + req.params.profile + "/stats";
    res.redirect(redirect_url);
}
exports.records = function(req,res) {
    calendarDB.get_calendar().then((list) => {
        history = new achievements(list);
        history.get_records().then((records) => {
            res.render("records", {
                "title": req.params.profile + "'s records",
                "name": req.params.profile,
                "cardio": records[0],
                "gym": records[1],
                "sport": records[2]
            });
        })
    });
}

// ------------------------------------------------------------
// TRAINING PLAN FUNCTIONS
exports.new_plan = function(req,res) {
    week = req.params.week;
    page_url = req.url;
    can_post = (!empty_plan & current_plan.get_num()>=3);
    if (empty_plan) {
        console.log("Starting new training plan...");
        current_plan = new training_plan();
        empty_plan = false;
        creating_plan = true;
    }
    current_plan.get_list().then((list) => {
        res.render("training_plan/new_plan", {
            "title": "New plan",
            "week": week,
            "cardio": list[0],
            "gym": list[1],
            "sport": list[2],
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
    creating_plan = false;
    redirect_url = "/" + req.user.username + "/calendar";
    res.redirect(redirect_url);
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
    if (!creating_plan) {
        calendarDB.modify_week(week,current_plan);
    }
    redirect_url = req.url.replace(/\/new-.*/,"");
    console.log("Redirecting to",redirect_url);
    res.redirect(redirect_url);
}
exports.complete_exercise = function(req,res) {
    current_plan.complete_exercise(req.params.type,req.params.id);
    calendarDB.modify_week(week,current_plan);
    redirect_url = req.url.replace(/\/complete-.*/,"");
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
    if (!creating_plan) {
        calendarDB.modify_week(week,current_plan);
    }
    redirect_url = req.url.replace(/\/modify-.*/,"");
    res.redirect(redirect_url);
}
exports.delete_exercise = function(req,res) {
    current_plan.delete_exercise(req.params.type,req.params.id);
    if (!creating_plan) {
        calendarDB.modify_week(week,current_plan);
    }
    redirect_url = req.url.replace(/\/delete-.*/,"");
    res.redirect(redirect_url);
}