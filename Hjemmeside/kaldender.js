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

function renderWeek(date, setDatePicker = true) {
    const datePicker = document.getElementById('datepicker');

    if(setDatePicker) {
        const oneDayAhead = new Date(date);
        oneDayAhead.setDate(oneDayAhead.getDate() + 1);
        oneDayAhead.setHours(13, 0, 0, 0);
        const fp = flatpickr(datePicker, {
            locale: "da",
            enableTime: true,
            dateFormat: "d-m-Y H:i",
            time_24hr: true,
            minDate: "today",
            minTime: "08:00",
            maxTime: "17:00",
            weekNumbers: true,
        });
        fp.setDate(oneDayAhead);
    }

    const yourTime = document.querySelector('.your-booking');
    if(yourTime){
        addYourTimeKaldender(0)
    }

    document.getElementById('week').textContent = "Uge " + getWeekNumber(date);
    
    getWeekDates(date).forEach((day, index) => {
        document.getElementById('date' + index).textContent = day;
    })
}
function addService(service) {
    const selectedServices = document.getElementById('selected_services_list');
    const newService = document.createElement('div');
    selectedServices.appendChild(newService);
    
    const value = service.split(' - ');
    span1 = document.createElement('span');
    span1.classList.add('service');
    span1.textContent = value[0];
    newService.appendChild(span1);
    span2 = document.createElement('span');
    span2.classList.add('time');
    span2.textContent = value[1];
    newService.appendChild(span2);
    span3 = document.createElement('span');
    span3.innerHTML = '<svg width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg"><path d="M5.33887 14.7065C4.9722 14.7065 4.65831 14.576 4.3972 14.3149C4.13609 14.0538 4.00553 13.7399 4.00553 13.3732V4.70654H3.33887V3.37321H6.6722V2.70654H10.6722V3.37321H14.0055V4.70654H13.3389V13.3732C13.3389 13.7399 13.2083 14.0538 12.9472 14.3149C12.6861 14.576 12.3722 14.7065 12.0055 14.7065H5.33887ZM12.0055 4.70654H5.33887V13.3732H12.0055V4.70654ZM6.6722 12.0399H8.00553V6.03988H6.6722V12.0399ZM9.33887 12.0399H10.6722V6.03988H9.33887V12.0399Z"/></svg>';
    span3.addEventListener('click', () => {
        newService.remove();
        addYourTimeKaldender(-Number(value[1].split(' ')[0]));
    })
    newService.appendChild(span3);

    addYourTimeKaldender(Number(value[1].split(' ')[0]));
}

document.addEventListener('DOMContentLoaded', () => {
    const prevArrow = document.getElementById('prev_week');
    prevArrow.classList.add('arrow-disabled');
    const nextArrow = document.getElementById('next_week');
    let currentDate = new Date();
    const datePicker = document.getElementById('datepicker');
    const servicePicker = document.getElementById('add_services');

    renderWeek(currentDate);
    nextArrow.addEventListener('click', () => {
        if(prevArrow.classList.contains('arrow-disabled')) prevArrow.classList.remove('arrow-disabled');
        currentDate.setDate(currentDate.getDate() + 7);
        renderWeek(currentDate);
    });
    prevArrow.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        if(currentDate < new Date()){
            currentDate = new Date();
            prevArrow.classList.add('arrow-disabled');
        }
        renderWeek(currentDate);
    });
    datePicker.addEventListener('change', () => {
        const selectedDate = new Date(stringToDateObject(datePicker.value));
        currentDate = selectedDate;
        renderWeek(currentDate, false);
    });

    servicePicker.addEventListener('change', () => {
        const selectedService = servicePicker.value;
        addService(selectedService);
        servicePicker.value = 'default';
    })

    const go_to_booking = document.getElementById('go_to_booking');
    go_to_booking.addEventListener('click', () => {
        console.log(getSelectedServices());
        //save to localstorage
        //localStorage.setItem('selectedServices', JSON.stringify(getSelectedServices()));
    })
})

function stringToDateObject(dateStr) {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute);
}

var TotalTimeOfYourBooking = 0;
function addYourTimeKaldender(time){
    const datePicker = document.getElementById('datepicker');
    TotalTimeOfYourBooking += time;
    const dateName = stringToDateObject(datePicker.value).toLocaleDateString("en-US", { weekday: "long" });
    const yourTime = document.querySelector('.your-booking');
    if(yourTime){
        yourTime.remove();
    }
    addTimeToKaldender(dateName.toLocaleLowerCase(), datePicker.value.split(' ')[1], TotalTimeOfYourBooking, true);
}

/**
 * Adds a booking time to the given day in the calendar
 * @param {String} day - The day of the week (monday, tuesday, etc.)
 * @param {String} strattime - The start time of the booking in the format HH:MM
 * @param {Number} lenght - The length of the booking in minutes
 * @param {Bool} lenght - The length of the booking in minutes
 */
function addTimeToKaldender(day, strattime, lenght, yourBokking = false){
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
    time.style.top = ((strattime.split(':')[0] - 8) + (strattime.split(':')[1] / 60)) * sizeRatio + 'px';
    time.style.height = (lenght / 60) * sizeRatio + 'px';
    if(lenght > 0){
        column.appendChild(time);
    }
}

function getSelectedServices(){
    const selectedServices = {};

    selectedServices['datetime'] = document.getElementById('datepicker').value;

    selectedServices['services'] = [];
    document.querySelectorAll('#selected_services_list div').forEach((service, index) => {
        const name = service.querySelector('.service').textContent;
        const time = Number(service.querySelector('.time').textContent.split(' ')[0]);
        const serviceObject = {};
        serviceObject['service' + index] = name;
        serviceObject['tid' + index] = time;

        selectedServices['services'].push(serviceObject);
    });
    selectedServices['totalTime'] = TotalTimeOfYourBooking;
    return selectedServices;
}