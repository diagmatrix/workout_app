const nedb = require('nedb');

/*
 * TRAINING PLAN CLASS
 * Handles a weekly training plan
 */
class training_plan {
    // Constructor
    constructor(cardio,strength,sport) {
        this.num = 0;
        // Strength collection init
        this.db_strength = new nedb();
        if (strength) {
            this.db_strength.insert(strength);
            this.num += strength.length;
        }
        // Cardio collection init
        this.db_cardio = new nedb();
        if (cardio) {
            this.db_cardio.insert(cardio);
            this.num += cardio.length;
        }
        // Sports collection init
        this.db_sport = new nedb();
        if (sport) {
            this.db_sport.insert(sport);
            this.num += sport.length;
        }
        console.log("Training plan object created with",this.num,"entries");
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
    // Adds a specific list of exercises to the plan
    set_preset(key) {
        switch (key) {
            case "outdoors":
                this.add_cardio("Hiking","10");
                this.add_cardio("Walking","10");
                this.add_cardio("Cycling","10");
                break;
            case "chest":
                this.add_strength("Bench Press","10","10");
                this.add_strength("Incline Press","10","10");
                this.add_strength("Dumbbell Chest Flyes","10","10");
                this.add_strength("Cable Crossovers","10","10");
                this.add_strength("Push-Up","10","10");
                break;
            case "shoulders":
                this.add_strength("Shoulder Press","10","10");
                this.add_strength("Lateral Dumbbell Raises","10","10");
                this.add_strength("Front Dumbbell Raises","10","10");
                this.add_strength("Upright Rows","10","10");
                this.add_strength("Dumbbell Shrugs","10","10");
                break;
            case "legs":
                this.add_strength("Squat","10","10");
                this.add_strength("Leg Press","10","10");
                this.add_strength("Leg Extensions","10","10");
                this.add_strength("Calf Raises","10","10");
                break;
            case "back":
                this.add_strength("Back Row","10","10");
                this.add_strength("Pull-Up","10","10");
                this.add_strength("Row","10","10");
                this.add_strength("Hyperextensions","10","10");
                break;
            case "arms":
                this.add_strength("Bicep Curl","10","10");
                this.add_strength("Tricep Curl","10","10");
                this.add_strength("Skull-crushers","10","10");
                this.add_strength("Bench Press","10","10");
                break;
        }
                
    }
}

module.exports = training_plan;