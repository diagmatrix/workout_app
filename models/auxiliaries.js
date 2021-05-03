const startOfWeek = require('date-fns/startOfWeek')
const add = require('date-fns/add')
const sub = require('date-fns/sub')
const eachWeekOfInterval = require('date-fns/eachWeekOfInterval')

const cardio_list = [
    "Running","Cycling","Hiking","Jogging",
    "Swimming","Racewalking","Walking"
];
const gym_list = [
    "Squat","Push-Up","Bench Press","Shoulder Press","Pull-up",
    "Back Row","Deadlift","Cable Crossovers","Bicep Curl",
    "Lateral Dumbbell Raises","Dumbbell Shrugs","Tricep Curl","Leg Press",
    "Chest Press", "Incline Press", "Dumbbell Chest Flyes", "Calf Raises",
    "Front Dumbbell Raises", "Upright Rows", "Leg Extensions",
    "Row", "Hyperextensions", "Skull-crushers"
];
const sport_list = [
    "Badminton","Padel","Tennis","Voleyball","Basketball",
    "Baseball","Cricket","Skateboarding","Surfing",
    "Martial arts","Yoga","Football","Rugby",
    "American Football","Handball","Gymnastics","Hockey"
];
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
// Creates a line chart for the progress of an exercise
function create_chart(progress) {
    if (progress.length==0)
        return null;
    // Creates labels
    var weeks = eachWeekOfInterval({
        start: new Date(progress[0].week),
        end: new Date(this_monday())
    },{weekStartsOn: 1});
    var labels = [];
    weeks.forEach(w => {
        labels.push({week: w.getFullYear() + "-" + (w.getMonth()+1) + "-" + w.getDate()});
    });
    // Creates data
    labels.forEach(y => {
        y.record = "-";
        progress.forEach(x => {
            if (x.week==y.week) {
                y.record = x.record;
            }
        });
    });
    return labels;
}

module.exports = {this_monday, change_week, remove_ids, cardio_list, gym_list, sport_list, create_chart}