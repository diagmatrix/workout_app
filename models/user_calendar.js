const { json } = require('body-parser');
const nedb = require('nedb');
const training_plan = require("./training_plan");

// User's calendar class
class user_calendar {
    // Constructor
    constructor(username) {
        var db_file_path = "./db/"+username+".db";
        this.db = new nedb({filename: db_file_path,autoload: true});
        console.log("DB connected to",db_file_path);
    }
    // Add a week
    add_week(date,plan) {
        plan.get_list().then((data) =>{
            data.forEach(type => {
                type.forEach(exercise => {
                    delete exercise["_id"];
                    exercise = JSON.stringify(exercise);
                })
                type = JSON.stringify(type);
            });
            this.db.insert({
                _id: date,
                plan: data
            },function(err,doc) {
                if (err) {
                    console.log("ERROR: Could not insert week plan");
                }
            });
        });
    }
    // Getting a week
    get_week(date) {
        var that = this;
        return new Promise((resolve,reject) => {
            this.db.find({_id: date},function(err,doc) {
                if (err) {
                    console.log("ERROR: Error searching for plan");
                    reject(err);
                } else if (doc.length==0) {
                    console.log("WARNING: Void plan.");
                    reject(null);
                } else {
                    resolve(doc);
                }
            });
        });        
    }
    // Modify a week
    modify_week(date,plan) {
        this.db.remove({_id: date},{},(err,n) => {
            if (err) {
                console.log("Error: Could not remove week");
            }
        });
        this.db.persistence.compactDatafile();
        this.add_week(date,plan);
    }
    // Gets the calendar
    get_calendar() {
        return new Promise((resolve,reject) => {
            this.db.find({},function(err,doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                    console.log("'get_calendar' returns:",doc);
                }
            });
        });
    }
}

module.exports = user_calendar