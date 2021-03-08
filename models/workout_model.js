const nedb = require('nedb');

class Workout {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({filename: dbFilePath,autoload: true});
            console.log("DB connected to "+dbFilePath);
        } else {
            this.db = new nedb();
            this.db.insert({
                type: "gym",
                name: "Bench press",
                weight: "30",
            });
            this.db.insert({
                type: "cardio",
                name: "cycling",
                distance: "20"
            });
            console.log("Initial entries inserted");
        }
    }
    get_gym_entries() {
        return new Promise((resolve,reject) => {
            this.db.find({type: "gym"},function(err,entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log("Function 'get_gym_entries' returns:",entries);
                }
            })
        });
    }
    get_cardio_entries() {
        return new Promise((resolve,reject) => {
            this.db.find({type: "cardio"},function(err,entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log("Function 'get_cardio_entries' returns:",entries);
                }
            })
        });
    }
    add_entry(type,name,dist_weight) {
        if (type=="cardio") {
            var entry = {
                type: "cardio",
                name: name,
                distance: dist_weight
            }
        } else {
            var entry = {
                type: "gym",
                name: name,
                weight: dist_weight
            }
        }
        console.log("Entry created: ",entry);
        this.db.insert(entry,function(err,doc) {
            if (err) {
                console.log("Error inserting document",name);
            } else {
                console.log("Document inserted in db",entry);
            }
        });
    }
}

module.exports = Workout;