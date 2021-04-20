const nedb = require('nedb');

// Training plan class
class training_plan {
    // Constructor
    constructor(db_file_path_strength,db_file_path_cardio,db_file_path_sport) {
        // Strength collection init
        if (db_file_path_strength) {
            this.db_strength = new nedb({filename: db_file_path_strength,autoload: true});
            console.log("strength DB connected to "+db_file_path_strength);
        } else {
            this.db_strength = new nedb();
            console.log("Strength db created");
        }
        // Cardio collection init
        if (db_file_path_cardio) {
            this.db_cardio = new nedb({filename: db_file_path_cardio,autoload: true});
            console.log("Cardio DB connected to "+db_file_path_cardio);
        } else {
            this.db_cardio = new nedb();
            console.log("Cardio db created");
        }
        // Sports collection init
        if (db_file_path_sport) {
            this.db_sport = new nedb({filename: db_file_path_sport,autoload: true});
            console.log("strength DB connected to "+db_file_path_sport);
        } else {
            this.db_sport = new nedb();
            console.log("Sport db created");
        }
        this.num = 0;
    }
    // Adds one sport entry
    add_sport(name,dur) {
        var entry = {
            name: name,
            duration: dur,
            completed: false
        }
        this.db_sport.insert(entry,function(err,doc) {
            if (err) {
                console.log("Error inserting document",name);
            } else {
                console.log("Document inserted in db",entry);
            }
        });
        this.num = this.num + 1;
    }
    // Adds one strength entry
    add_strength(name,weight,reps) {
        var entry = {
            name: name,
            weight: weight,
            repetitions: reps,
            completed: false
        }
        this.db_strength.insert(entry,function(err,doc) {
            if (err) {
                console.log("Error inserting document",name);
            } else {
                console.log("Document inserted in db",entry);
            }
        });
        this.num = this.num + 1;
    }
    // Adds one cardio entry
    add_cardio(name,dist) {
        var entry = {
            name: name,
            distance: dist,
            completed: false
        }
        this.db_cardio.insert(entry,function(err,doc) {
            if (err) {
                console.log("Error inserting document",name);
            } else {
                console.log("Document inserted in db",entry);
            }
        });
        this.num = this.num + 1;
    }
    // Completes an exercise
    complete_exercise(type,id) {
        var db;
        switch(type) {
            case "sport":
                db = this.db_sport;
                break;
            case "strength":
                db = this.db_strength;
                break;
            case "cardio":
                db = this.db_cardio;
                break;
            default:
                return false;
        }

        db.update({_id: id},{$set: {completed: true}},{},function(err,num) {
            if (err) {
                console.log("Error completing the exercise ",id);
                return false;
            } else {
                console.log("Completed exercise ",id);
                return true;
            }
        });
    }
    // Deletes an exercise
    delete_exercise(type,id) {
        var db;
        switch(type) {
            case "sport":
                db = this.db_sport;
                break;
            case "strength":
                db = this.db_strength;
                break;
            case "cardio":
                db = this.db_cardio;
                break;
            default:
                return false;
        }

        db.remove({_id: id},function(err,num) {
            if (err) {
                console.log("Error removing the exercise ",id);
                return false;
            } else {
                console.log("Removed exercise ",id);
                return true;
            }
        });
        this.num = this.num - 1;
    }
    // Gets one exercise
    // NOT IN DESIGN
    get_exercise(type,id) {
        var db;
        switch(type) {
            case "sport":
                db = this.db_sport;
                break;
            case "strength":
                db = this.db_strength;
                break;
            case "cardio":
                db = this.db_cardio;
                break;
            default:
                return false;
        }

        return new Promise((resolve,reject) => {
            db.find({_id: id},function(err,entry) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entry);
                    console.log("'get_exercise' returns:",entry);
                }
            })
        })
    }
    // Gets the training plan
    get_list() {
        // Sport entries
        var sport_entries = new Promise((resolve,reject) => {
            this.db_sport.find({},function(err,entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log("'sport_entries' returns:",entries);
                }
            })
        });
        // Strength entries
        var strength_entries = new Promise((resolve,reject) => {
            this.db_strength.find({},function(err,entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log("'strength_entries' returns:",entries);
                }
            })
        });
        // Cardio entries
        var cardio_entries = new Promise((resolve,reject) => {
            this.db_cardio.find({},function(err,entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log("'cardio_entries' returns:",entries);
                }
            })
        });
        
        console.log("Number of exercises: ",this.num);
        return Promise.all([sport_entries,strength_entries,cardio_entries]);
    }
    // Gets the total number of exercises
    get_num() { return this.num; }
    // Modifies a sport entry
    modify_sport(id,n_duration) {
        this.db_sport.update({_id: id},{$set: {
            duration: n_duration,
            completed: false
        }},{},function(err,num) {
            if (err) {
                console.log("Error modifying the sport exercise ",id);
                return false;
            } else {
                console.log("Modified sport exercise ",id);
                return true;
            }
        });
    }
    // Modifies a strength entry
    modify_strength(id,series) {
        this.db_strength.update({_id: id},{$set: {
            weight: series[0],
            repetitions: series[1],
            completed: false
        }},{},function(err,num) {
            if (err) {
                console.log("Error modifying the strength exercise ",id);
                return false;
            } else {
                console.log("Modified strength exercise ",id);
                return true;
            }
        });
    }
    // Modifies a cardio entry
    modify_cardio(id,n_distance) {
        this.db_cardio.update({_id: id},{$set: {
            distance: n_distance,
            completed: false
        }},{},function(err,num) {
            if (err) {
                console.log("Error modifying the cardio exercise ",id);
                return false;
            } else {
                console.log("Modified cardio exercise ",id);
                return true;
            }
        });
    }
    // Creates a training plan from scratch from a key (assumes empty plan)
    set_preset(key) {
        // TODO
    }
}

module.exports = training_plan;