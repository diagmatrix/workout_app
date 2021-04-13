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

exports.new_entry = function(req,res) {
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

exports.post_new_entry = function(req,res) {
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