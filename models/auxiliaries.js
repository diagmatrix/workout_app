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
// Gets the image of an exercise
function get_img(name) {
    switch(name) {
        case "Running":
            return "https://www.sportplushealth.com/blog/wp-content/uploads/2015/12/donna-running.jpg";
        case "Cycling":
            return "https://blog.mapmyrun.com/wp-content/uploads/2018/10/The-10-Best-Cycling-Tips-We%E2%80%99ve-Ever-Heard-1.jpg";
        case "Hiking":
            return "https://www.besthealthmag.ca/wp-content/uploads/sites/16/2018/04/Heli-Hiking.jpg";
        case "Jogging":
            return "https://www.technogym.com/wpress/wp-content/uploads/2016/11/shutterstock_315909608-1.jpg";
        case "Swimming":
            return "https://i.ytimg.com/vi/-d3UuHf9-d0/maxresdefault.jpg";
        case "Racewalking":
            return "https://i.ytimg.com/vi/8GdifZlU040/maxresdefault.jpg";
        case "Walking":
            return "http://i.huffpost.com/gen/1778943/images/o-OLDER-PEOPLE-WALKING-facebook.jpg";
        case "Squat":
            return "https://d2z0k43lzfi12d.cloudfront.net/blog/vcdn294/wp-content/uploads/2018/06/how-to-squat-properly-without-mistake.jpg";
        case "Push-Up":
            return "http://www.myselfcare.org/wp-content/uploads/2020/11/do-push-ups-build-muscle.jpg";
        case "Bench Press":
            return "https://cdn2.coachmag.co.uk/sites/coachmag/files/2017/05/bench-press_0.jpg";
        case "Shoulder Press":
            return "https://d318e6q4e3so0o.cloudfront.net/wp-content/uploads/2018/04/17082328/Starting_Shoulder_Press_0700.jpg";
        case "Pull-up":
            return "https://www.healthmates.com.au/wp-content/uploads/2013/04/Pull-ups.jpg";
        case "Back Row":
            return "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/mh-barbellrow-jpg-1563984582.jpg?crop=1.00xw:0.752xh;0,0.115xh&resize=1200:*";    
        case "Deadlift":
            return "https://barbend.com/wp-content/uploads/2019/04/Deadlift.jpg";
        case "Cable Crossovers":
            return "http://www.bodybuilding.com/exercises/exerciseImages/sequences/132/Male/l/132_1.jpg";
        case "Bicep Curl":
            return "https://barbend.com/wp-content/uploads/2019/10/bicep-curl-.jpg";
        case "Lateral Dumbbell Raises":
            return "https://i.ytimg.com/vi/sPJkyrKI630/maxresdefault.jpg";
        case "Dumbbell Shrugs":
            return "https://weviral.org/blog/wp-content/uploads/2020/07/word-image.jpeg";
        case "Tricep Curl":
            return "http://workoutware.net/wp-content/uploads/2017/07/Olympic-Curl-Bar-amp-Dumbbell-Handle-Combo-ODC-21-Bicep-Tricep-Gym-Weight-Barbell.jpg";
        case "Leg Press":
            return "http://best-exercise.com/wp-content/uploads/2018/08/leg-press.jpg";
        case "Chest Press":
            return "https://www.eliteexerciseequipment.com/wp-content/uploads/2018/12/PPS-200_chestpress1.jpg";
        case "Incline Press":
            return "https://fitnessista.com/wp-content/uploads/2018/05/inclinechestpress.jpg";
        case "Dumbbell Chest Flyes":
            return "http://cdn1.coachmag.co.uk/sites/coachmag/files/styles/insert_main_wide_image/public/2016/07/1-2b-incline-dumbbell-flye.jpg?itok=UA2JTZC2";
        case "Calf Raises":
            return "http://i.ytimg.com/vi/-M4-G8p8fmc/maxresdefault.jpg";
        case "Front Dumbbell Raises":
            return "http://bodybuilding-wizard.com/wp-content/uploads/2014/07/front-dumbbell-raise.jpg";
        case "Upright Rows":
            return "http://upl.stack.com/wp-content/uploads/2017/05/18111315/Upright-Row-STACK-654x428.jpg";
        case "Leg Extensions":
            return "https://fitdir.com/wp-content/uploads/2013/11/legextension_pos02_n.jpg";
        case "Row":
            return "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-82c-single-arm-cable-seated-row-m1-16x9.jpg";
        case "Hyperextensions":
            return "http://www.true-natural-bodybuilding.com/equipment/hyperextensions/fitness-hyperextension-09.jpg";
        case "Skull-crushers":
            return "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/hdm119918mh16094-1544025589.png?crop=1.00xw:0.752xh;0,0.248xh&resize=1200:*";
        case "Badminton":
            return "https://pixfeeds.com/images/26/558020/1200-519740608-badminton-player-grip.jpg";
        case "Padel":
            return "https://i0.wp.com/raquetc.com/wp-content/uploads/2020/05/Padel.jpg?resize=800%2C500&ssl=1";
        case "Tennis":
            return "https://www.eyofbaku2019.com/images/sport%20pages/tennis.jpeg";
        case "Voleyball":
            return "https://volleycountry.com/wp-content/uploads/2019/08/volleyball-girl.jpg";
        case "Basketball":
            return "https://baptisthealth.net/baptist-health-news/wp-content/uploads/2016/03/basketball_146870648_1600.jpg";
        case "Baseball":
            return "https://dailybruin.com/images/2017/04/web.sp_.baseball.pre_.HM_2.jpg";
        case "Cricket":
            return "https://blog.playo.co/wp-content/uploads/2017/12/leg-glance-cricket.jpg";
        case "Skateboarding":
            return "https://images.theconversation.com/files/132948/original/image-20160803-12223-1mn7k3u.jpg?ixlib=rb-1.1.0&rect=43%2C93%2C1684%2C817&q=45&auto=format&w=1356&h=668&fit=crop";
        case "Surfing":
            return "http://blog.hihostels.com/wp-content/uploads/2014/04/surfing.jpg";
        case "Martial arts":
            return "https://vidooly.com/blog/wp-content/uploads/2018/04/Wallpapers-1440x900.jpg";
        case "Yoga":
            return "https://cdn.asiatatler.com/asiatatler/i/th/2020/05/30234818-kike-vega-f2qh3yjz6jk-unsplash_cover_2000x1261.jpg";
        case "Football":
            return "http://www.underdale.sa.edu.au/images/banners/football.jpg";
        case "Rugby":
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/James_Hart_-_Us_Oyonnax_vs._FC_Grenoble_Rugby%2C_29th_March_2014.jpg/1200px-James_Hart_-_Us_Oyonnax_vs._FC_Grenoble_Rugby%2C_29th_March_2014.jpg";
        case "American Football":
            return "http://4.bp.blogspot.com/-LT2stikn_oc/ThbZFFP_0SI/AAAAAAAAABE/RJThYtqtiVI/s1600/football+americain.jpg"
        case "Handball":
            return "http://4.bp.blogspot.com/-K_PqXtTMjW0/T5Adr5ZhACI/AAAAAAAAAjM/-1x-_kUdfaw/s1600/r285071_1214206.jpg"
        case "Gymnastics":
            return "https://www.collegeparkgymnastics.com.au/wp-content/uploads/2018/09/GymnasticsWA-Session7A_B-JuniorChamps2019-SI-SportsImagery-3432-1.jpg";
        case "Hockey":
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/HOCKEY_ARGENTINA_PAKISTAN.jpg/1920px-HOCKEY_ARGENTINA_PAKISTAN.jpg";
        default:
            return "https://i.ebayimg.com/images/i/222163678653-0-1/s-l1000.jpg";
    }
}

module.exports = {this_monday, change_week, remove_ids, cardio_list, gym_list, sport_list, create_chart, get_img}