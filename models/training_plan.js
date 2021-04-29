const nedb = require('nedb');
const { this_monday } = require('./date_management');

// Training plan class
class training_plan {
    // Constructor
    constructor() {
        // Strength collection init
        this.db_strength = new nedb();
        // Cardio collection init
        this.db_cardio = new nedb();
        // Sports collection init
        this.db_sport = new nedb();
        this.num = 0;
        console.log("New void training plan object created");
    }
    // Creates a plan from a list
    create_from_list(cardio,strength,sport) {
        this.clear();
        // Adding all cardio entries
        this.db_cardio.insert(cardio);
        // Adding all strength entries
        this.db_strength.insert(strength);
        // Adding all sport entries
        this.db_sport.insert(sport);

        this.num += cardio.length + strength.length + sport.length;
        console.log("New training plan created with "+this.num+" exercises");
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
                console.log("ERROR: Could not insert document");
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
                console.log("ERROR: Could not insert document");
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
                console.log("ERROR: Could not insert document");
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
                console.log("ERROR: Could not complete exercise");
                return false;
            } else {
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
                console.log("ERROR: Could not remove exercise");
                return false;
            } else {
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
                    console.log("'sport_entries' returns",entries.length,"entries");
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
                    console.log("'strength_entries' returns",entries.length,"entries");
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
                    console.log("'cardio_entries' returns",entries.length,"entries");
                }
            })
        });
        
        console.log("Number of exercises:",this.num);
        return Promise.all([cardio_entries,strength_entries,sport_entries,]);
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
                console.log("ERROR: Could not modify exercise");
                return false;
            } else {
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
                console.log("ERROR: Could not modify exercise");
                return false;
            } else {
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
                console.log("ERROR: Could not modify exercise");
                return false;
            } else {
                return true;
            }
        });
    }
    // Creates a training plan from scratch from a key (assumes empty plan)
    set_preset(key) {
        // TODO
    }
    // Deletes all entries
    clear() {
        console.log("Clearing training plan object");
        this.db_cardio.remove({},(err,num) => {
            if (err) {
                console.log("Error clearing cardio DB");
            }
        });
        this.db_strength.remove({},(err,num) => {
            if (err) {
                console.log("Error clearing strength DB");
            }
        });
        this.db_sport.remove({},(err,num) => {
            if (err) {
                console.log("Error clearing sport DB");
            }
        });
        this.num = 0;
    }
}

module.exports = training_plan;