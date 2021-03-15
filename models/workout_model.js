const nedb = require('nedb');

class Workout {
    constructor(dbFilePathGym,dbFilePathCardio) {
        if (dbFilePathGym) {
            this.db_gym = new nedb({filename: dbFilePathGym,autoload: true});
            console.log("Gym DB connected to "+dbFilePathGym);
        } else {
            this.db_gym = new nedb();
            this.db_gym.insert({
                name: "Bench press",
                weight: "30",
            });
            console.log("Initial entries inserted to Gym db");
        }
        if (dbFilePathCardio) {
            this.db_cardio = new nedb({filename: dbFilePathCardio,autoload: true});
            console.log("Cardio DB connected to "+dbFilePathCardio);
        } else {
            this.db_cardio = new nedb();
            this.db_cardio.insert({
                name: "cycling",
                distance: "20"
            });
            console.log("Initial entries inserted to Cardio db");
        }
    }
    get_gym_entries() {
        return new Promise((resolve,reject) => {
            this.db_gym.find({},function(err,entries) {
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
            this.db_cardio.find({},function(err,entries) {
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
                name: name,
                distance: dist_weight
            }
            console.log("Cardio entry created: ",entry);
            this.db_cardio.insert(entry,function(err,doc) {
                if (err) {
                    console.log("Error inserting document",name);
                } else {
                    console.log("Document inserted in db",entry);
                }
            });
        } else {
            var entry = {
                name: name,
                weight: dist_weight
            }
            console.log("Gym entry created: ",entry);
            this.db_gym.insert(entry,function(err,doc) {
                if (err) {
                    console.log("Error inserting document",name);
                } else {
                    console.log("Document inserted in db",entry);
                }
            });
        }
    }
}

module.exports = Workout;