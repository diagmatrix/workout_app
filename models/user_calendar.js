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
        console.log("Adding plan",plan);
        if (plan) {
            plan.get_list().then((data) =>{
                var entry = {
                    date: date,
                    plan: data
                }
                this.db.insert(entry,function(err,doc) {
                    if (err) {
                        console.log("ERROR: Could not insert week plan");
                    } else {
                        console.log("Document inserted in db:",doc);
                    }
                });
            });
        } else {
            this.db.insert({
                date: date,
                plan: [[],[],[]]},function(err,doc) {
                if (err) {
                    console.log("ERROR: Could not insert week plan");
                } else {
                    console.log("Document inserted in db:",doc);
                }
            });
        }
    }
    // Getting a week
    get_week(date) {
        var that = this;
        var plan = new training_plan();
        var exists = true;
        console.log("Getting week",date);
        this.db.findOne({date: date},function(err,doc) {
            if (err) {
                console.log("ERROR: Error searching for plan");
            } else if (!doc) {
                console.log("WARNING: No entry for this week. Adding it");
                that.add_week(date,null);
                exists = false;
            } else {
                console.log("Plan found");
                plan.create_from_list(doc.plan[0],doc.plan[1],doc.plan[2]);
            }
        });
        if (exists) {
            return plan.get_list();
        } else {
            return new Promise((resolve,reject) => {
                resolve([[],[],[]]);
            });
        }
    }
    // Modify a week
    modify_week(date,plan) {
        plan.get_list().then((data) =>{
            this.db.update({date: date},{$set: {
                plan: plan
            }},{},function(err,num) {
                if (err) {
                    console.log("ERROR: Could not modify week",date);
                    return false;
                } else {
                    console.log("Modified week",date);
                    return true;
                }
            });
        });
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