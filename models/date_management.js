const startOfWeek = require('date-fns/startOfWeek')

// Calculates current week's Monday
function this_monday() {
    var monday = startOfWeek(new Date(),{weekStartsOn: 1});
    return monday.getFullYear() + "/" + (monday.getMonth()+1) + "/" + monday.getDate();
}

module.exports = {this_monday}