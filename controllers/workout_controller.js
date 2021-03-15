const { response } = require("express");
const workout_class = require("../models/workout_model");
const db = new workout_class();

exports.landing_page = function(req,res) {
    console.log("Landing page");
    res.render("landing",{"title": "Workout"});
}

exports.go_list = function(req,res) {
    console.log("Landing page -> Exercises");
    res.redirect("/exercises");
}

exports.entries_list = function(req,res) {
    console.log("\n--------\nExercises");
    
    Promise.all([db.get_cardio_entries(),db.get_gym_entries()]).then((list) => {
        res.render("exercises",{
            "title": "Workouts. List",
            "cardio": list[0],
            "gym": list[1]
        });
        console.log("Promise resolved.");
    }).catch((err) => {
        console.log("Promise rejected:",err);
    });
}

exports.go_new = function(req,res) {
    console.log("Exercises -> New");
    res.redirect("/new");
}

exports.new_entry = function(req,res) {
    console.log("New");
    res.render("new_entry", {"title": "Workout. Add entry"});
}

exports.post_new_entry = function(req,res) {
    console.log("Processing new entry controller");
    if (!req.body.name) {
        res.status(400).send("Entries must have an author");
        return;
    }
    db.add_entry(req.body.type,req.body.name,req.body.dist_weight);
    
    console.log("New -> Exercises");
    res.redirect("/exercises");
}