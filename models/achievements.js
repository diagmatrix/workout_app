const nedb = require("nedb");
const { cardio_list,gym_list,sport_list } = require("./auxiliaries");

/*
 * ACHIEVEMENTS CLASS
 * Handles:
 *  - Records
 *  - Stats
 */
class achievements {
    // Constructor
    constructor(calendar) {
        if (!calendar) {
            this.history = new nedb();
            console.log("WARNING: Creating void history of user");
        } else {
            // Transforms the calendar into an array with {exercise,amount,week}
            var exercise_array = []
            calendar.forEach(x => {
                x.plan = x.plan.flat();
                // Remove incompleted exercises
                x.plan = x.plan.filter(p => {
                    return p.completed;
                });
                x.plan.forEach(y => {
                   delete y.completed;
                   delete y.repetitions;
                   y.week = x._id;
                });
                delete x._id;
                exercise_array.push(x.plan);
             });
             exercise_array = exercise_array.flat();
            // Creates an entry for each exercise
            var entries = [];
            function type_entries(list,name,type) {
                list.forEach(x => {
                    let entry = {
                        _id: x,
                        type: type,
                        progress: []
                    }
                    exercise_array.forEach(y => {
                        if (x==y.name) {
                            entry.progress.push({week: y.week,record: y[name]});
                        }
                    });
                    entries.push(entry);
                 });
            }
            type_entries(cardio_list,"distance","cardio");
            type_entries(gym_list,"weight","strength");
            type_entries(sport_list,"duration","sport");
            this.history = new nedb();
            this.history.insert(entries,function(err,docs) {
                if (err) {
                    console.log("ERROR: Could not create history");
                }
            });
        }
    }
    // Gets the weekly progress of exercise "name"
    get_progress(name) {
        return new Promise((resolve,reject) => {
            this.history.find({_id: name},function(err,doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }
    // Gets the list of pairs [exercise name,record]
    get_records() {
        return new Promise((resolve,reject) => {
            this.history.find({},function(err,list) {
                if (err) {
                    reject(err);
                } else {
                    var cardio = [];
                    var strength = [];
                    var sport = [];
                    list.forEach(x => {
                        var entry = {name: x._id, record: "-" };
                        if (x.progress.length>0) {
                            entry.record = Math.max(...x.progress.map(y => {
                                return parseInt(y.record);
                            })).toString();
                        }
                        if (x.type=="cardio") {
                            cardio.push(entry);
                        } else if (x.type=="strength") {
                            strength.push(entry);
                        } else {
                            sport.push(entry);
                        }
                    });
                    resolve([cardio,strength,sport]);
                }
            });
        });
        // Transform into records

    }
}

module.exports = achievements