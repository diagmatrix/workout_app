const nedb = require("nedb");
const { cardio_list,gym_list,sport_list } = require("./auxiliaries");

// Achievements class
class achievements {
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
}

module.exports = achievements