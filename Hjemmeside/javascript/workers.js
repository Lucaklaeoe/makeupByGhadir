/**
 * Calculates the ISO week number for a given date.
 *
 * @param {Date} [date=new Date()] - The date for which to calculate the week number. Defaults to the current date.
 * @returns {number} The ISO week number of the given date.
 */
function getWeekNumber(date = new Date()) {
    //86.400.000 ms = 1 dag
    date.setHours(0, 0, 0, 0);
    //Finder den nuværrende torsdag
    //ISO standarden starter året på en torsdag
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    //Finder den første torsdag i det aktuelle år
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Beregner antal dage siden mandagen i den første ISO-uge    
    const diff_in_days = Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7));
    // Beregner uge nummer + 1 da uger ikke starter på 0
    return diff_in_days / 7 + 1;
}

/**
 * Generates an array of dates for the week of a given date.
 * The dates are represented as strings in the format "DD. MMM".
 *
 * @param {Date} [date=new Date()] - The date for which to calculate the week dates. Defaults to the current date.
 * @returns {string[]} An array of seven strings representing the dates of the week of the given date.
 */
function getWeekDates(date = new Date()) {
    date.setHours(0, 0, 0, 0);
    // ISO: Mandag = 0, Søndag = 6
    const isoDay = (date.getDay() + 6) % 7;
    // Gå tilbage til mandag
    date.setDate(date.getDate() - isoDay);
    // Saml alle 7 dage
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(date);
        d.setDate(date.getDate() + i);
        weekDates.push(d.getDate() + ". " + d.toLocaleString('default', { month: 'short' }));    
    }
    return weekDates;
}

/**
 * Converts a date string in the format "DD-MM-YYYY HH:MM" to a Date object.
 * @param {string} dateStr - The date string to convert.
 * @returns {Date} The Date object corresponding to the given date string.
 */
function stringToDateObject(dateStr) {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute);
}

/**
 * Adds a time slot to the week view calendar.
 * @param {string} day - The day of the week to add the time slot to. Possible values: "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday".
 * @param {string} strattime - The start time of the time slot in the format "HH:MM".
 * @param {number} lenght - The length of the time slot in minutes.
 * @param {boolean} [yourBokking=false] - Whether the time slot should be marked as your booking.
 * @param {string} [color=null] - Adds a color to the time slot, and ignores the the submit button, format: hex #RRGGBB.
 * @param {string} [id=null] - Adds id text to the timeslot.
 *
 */
function addTimeToKaldender(day, strattime, lenght, yourBokking = false, color = null, id = null){
    const column = document.querySelector('.' + day + ' .showen-time');
    const columnHeight = column.getBoundingClientRect().height;
    //height of one hour
    const sizeRatio = columnHeight / 10;

    const time = document.createElement('div');
    time.classList.add('booking-time');
    if(yourBokking){
        time.classList.add('your-booking');
        time.textContent = "Din tid";
    }
    time.style.left = '0';
    time.style.top = ((strattime.split(':')[0] - 8) + (strattime.split(':')[1] / 60)) * sizeRatio + 'px';
    time.style.height = (lenght / 60) * sizeRatio + 'px';
    if(lenght > 0){
        column.appendChild(time);
    }
    if(color) {
        time.style.backgroundColor = color + "40";
        time.style.borderColor = color;
        if(id){
            time.textContent = id;
            time.id = id;
        } 
        return;
    }
    if(validateBooking(false)){
        const submitButton = document.querySelectorAll(".go_to_booking");
        submitButton.forEach(submitButton => submitButton.classList.remove('disabled'));
    }
    else {
        const submitButton = document.querySelectorAll(".go_to_booking");
        submitButton.forEach(submitButton => {
            if(submitButton.classList.contains('disabled')) return;
            submitButton.classList.add('disabled');
        });
    }
}