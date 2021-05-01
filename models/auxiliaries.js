const startOfWeek = require('date-fns/startOfWeek')
const add = require('date-fns/add')
const sub = require('date-fns/sub')

// Calculates current week's Monday
function this_monday() {
    var monday = startOfWeek(new Date(),{weekStartsOn: 1});
    return monday.getFullYear() + "-" + (monday.getMonth()+1) + "-" + monday.getDate();
}
// Gets the following week
function change_week(current,action) {
    switch(action) {
        case "next":
            var new_monday = add(new Date(current),{weeks: 1});
            return new_monday.getFullYear() + "-" + (new_monday.getMonth()+1) + "-" + new_monday.getDate();
        case "prev":
            var new_monday = sub(new Date(current),{weeks: 1});
            return new_monday.getFullYear() + "-" + (new_monday.getMonth()+1) + "-" + new_monday.getDate();
        default:
            return current; 
    }
}
// Removes the ids of the list of exercises of a training plan
function remove_ids(data) {
    data.forEach(type => {
        type.forEach(exercise => {
            delete exercise["_id"];
            exercise = JSON.stringify(exercise);
        })
        type = JSON.stringify(type);
    });
}


module.exports = {this_monday, change_week, remove_ids}