const { response } = require("express");
const training_plan = require("../models/training_plan");
const training_plan_db = new training_plan();

exports.landing_page = function(req,res) {
    console.log("Landing page");
    
    training_plan_db.get_list().then((list) => {
        res.render("training_plan",{
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
        res.render("new_cardio", {
            "title": "Add exercise"
        });
    } else if (type=="strength") {
        res.render("new_strength", {
            "title": "Add exercise"
        });
    } else if (type=="sport") {
        res.render("new_sport", {
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

    res.redirect("/");
}

exports.complete_exercise = function(req,res) {
    training_plan_db.complete_exercise(req.params.type,req.params.id);
    res.redirect("/")
}

exports.modify_exercise = function(req,res) {
    var type = req.params.type;

    training_plan_db.get_exercise(type,req.params.id).then((data) => {
        var exercise = data[0]
        switch(type) {
            case "cardio":
                res.render("modify_cardio", {
                    "title": "Modify exercise "+ exercise.name,
                    "name": exercise.name,
                    "distance": exercise.distance,
                    "id": exercise._id
                });
                break;
            case "strength":
                res.render("modify_strength", {
                    "title": "Modify exercise "+ exercise.name,
                    "name": exercise.name,
                    "weight": exercise.weight,
                    "repetitions": exercise.repetitions,
                    "id": exercise._id
                });
                break;
            case "sport":
                res.render("modify_sport", {
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
    
    if (type=="cardio") {
        training_plan_db.modify_cardio(req.body.id,req.body.distance);
    } else if (type=="strength") {
        training_plan_db.add_strength(req.body.id,[req.body.weight,req.body.repetitions]);
    } else if (type=="sport") {
        training_plan_db.add_sport(req.body.id,req.body.duration);
    } else {
        console.log("Error: No type ",type);
    }

    res.redirect("/");
}

exports.delete_exercise = function(req,res) {
    training_plan_db.delete_exercise(req.params.type,req.params.id);
    res.redirect("/")
}