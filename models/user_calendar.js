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
        if (plan) {
            plan.get_list().then((data) =>{
                data.forEach(type => {
                    type.forEach(exercise => {
                        delete exercise["_id"]
                    })
                    console.log(type);
                });
                var entry = {
                    _id: date,
                    plan: JSON.stringify(data)
                };
                this.db.insert(entry,function(err,doc) {
                    if (err) {
                        console.log("ERROR: Could not insert week plan");
                    } else {
                        console.log("Plan inserted in db.");
                    }
                });
            });
        } else {
            this.db.insert({
                _id: date,
                plan: [[],[],[]]},function(err,doc) {
                if (err) {
                    console.log("ERROR: Could not insert week plan");
                } else {
                    console.log("Plan inserted in db");
                }
            });
        }
    }
    // Getting a week
    get_week(date) {
        var that = this;
        return new Promise((resolve,reject) => {
            this.db.find({_id: date},function(err,doc) {
                if (err) {
                    console.log("ERROR: Error searching for plan");
                    reject(err);
                } else if (!doc) {
                    console.log("WARNING: Void plan.");
                    that.add_week(date,null);
                    resolve(null);
                } else {
                    console.log(doc.plan);
                    resolve(doc.plan);
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