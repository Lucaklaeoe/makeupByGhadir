const datePicker = document.getElementById('datepicker');
const timePicker = document.getElementById('timepicker');

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

    if(setDatePicker) {
        const oneDayAhead = new Date(date) <= new Date() ? new Date() : new Date(date);
        //failsafe if it's sunday and tries to get monday from next week
        if(oneDayAhead.toLocaleString('en', { weekday: 'long' }).toLowerCase() == 'sunday') oneDayAhead.setDate(oneDayAhead.getDate() - 1);
        oneDayAhead.setDate(oneDayAhead.getDate() + 1);
        oneDayAhead.setHours(13, 0, 0, 0);
        const fpdate = flatpickr(datePicker, {
            locale: "da",
            dateFormat: "d-m-Y",
            weekNumbers: true,
            minDate: "today",
        });
        fpdate.setDate(oneDayAhead, true);
        const fpTime = flatpickr(timePicker, {
            locale: "da",
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            minTime: "08:00",
            maxTime: "17:00",
        });
        fpTime.setDate(oneDayAhead, true);
    }

    const yourTime = document.querySelector('.your-booking');
    if(yourTime){
        addYourTimeKaldender(0)
    }
    
    if(document.getElementById('week').textContent.replace('Uge ', '') != getWeekNumber(date)) {
        document.querySelectorAll('.booking-time').forEach(time => {
            if(time.classList.contains('your-booking')) return;
            time.remove();
        })
        insertAllreadyBookedBookings(date);
    }
    document.getElementById('week').textContent = "Uge " + getWeekNumber(date);
    
    getWeekDates(date).forEach((day, index) => {
        document.getElementById('date' + index).textContent = day;
    })
}
function addService(service) {
    const selectedServices = document.getElementById('selected_services_list');
    const newService = document.createElement('div');
    newService.classList.add('serviceitem');
    selectedServices.appendChild(newService);
 
    const service_label = service.split('%')[0];
    const service_duration = Number(service.split('%')[1]);
    const service_price = service.split('%')[2];
    const service_price_formated = Number(service_price).toLocaleString('de-DE');
    const service_andtal_personer = Number(service.split('%')[3]);
    const service_andtal_personer_formated = service_andtal_personer <= 1 ? service_andtal_personer + ' person' : service_andtal_personer + ' personer';
    const service_inkl = service.split('%')[4];

    const icon = document.createElement('span');
    icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg"><path d="M5.33887 14.7065C4.9722 14.7065 4.65831 14.576 4.3972 14.3149C4.13609 14.0538 4.00553 13.7399 4.00553 13.3732V4.70654H3.33887V3.37321H6.6722V2.70654H10.6722V3.37321H14.0055V4.70654H13.3389V13.3732C13.3389 13.7399 13.2083 14.0538 12.9472 14.3149C12.6861 14.576 12.3722 14.7065 12.0055 14.7065H5.33887ZM12.0055 4.70654H5.33887V13.3732H12.0055V4.70654ZM6.6722 12.0399H8.00553V6.03988H6.6722V12.0399ZM9.33887 12.0399H10.6722V6.03988H9.33887V12.0399Z"/></svg>';
    icon.addEventListener('click', () => {
        newService.remove();
        addYourTimeKaldender(-service_duration);
    })
    
    newService.innerHTML = '<div class="service-top"><span class="service">' + service_label + '</span><span class="price">' + service_price_formated + ' Kr.</span></div><div class="service-bottom"><div class="genneral-info"><span>Servicen gælder ' + service_andtal_personer_formated + '</span><span>Inkl. ' + service_inkl + '</span></div> <div><span class="duration">' + service_duration + ' min</span></div></div>';

    const serviceTop = newService.querySelector('.service-top');
    serviceTop.appendChild(icon);

    addYourTimeKaldender(service_duration);
}

document.addEventListener('DOMContentLoaded', () => {
    const prevArrow = document.getElementById('prev_week');
    prevArrow.classList.add('arrow-disabled');
    const nextArrow = document.getElementById('next_week');
    let currentDate = new Date();
    const servicePicker = document.getElementById('add_services');

    renderWeek(currentDate);
    renderServiceOptions();
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
    timePicker.addEventListener('change', () => {
        const selectedDate = new Date(stringToDateObject(datePicker.value + " " + timePicker.value));
        currentDate = selectedDate;
        renderWeek(currentDate, false);
    })
    datePicker.addEventListener('change', () => {
        const selectedDate = new Date(stringToDateObject(datePicker.value + " " + timePicker.value));
        currentDate = selectedDate;
        renderWeek(currentDate, false);
    });

    servicePicker.addEventListener('change', () => {
        const selectedService = servicePicker.value;
        addService(selectedService);
        servicePicker.value = 'default';
    })

    const go_to_booking = document.getElementById('go_to_booking');
    go_to_booking.addEventListener('click', (event) => {
        event.preventDefault();
        if(validateBooking()){
            localStorage.setItem('selectedservices', JSON.stringify(getSelectedServices()));
            window.location = "booking2.html";
        }
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
    TotalTimeOfYourBooking += time;
    const dateName = stringToDateObject(datePicker.value + " " + timePicker.value).toLocaleDateString("en-US", { weekday: "long" });
    const yourTime = document.querySelector('.your-booking');
    if(yourTime){
        yourTime.remove();
    }
    addTimeToKaldender(dateName.toLocaleLowerCase(), timePicker.value, TotalTimeOfYourBooking, true);
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
    selectedServices['datetime'] = stringToDateObject(datePicker.value + ' ' + timePicker.value).toISOString();
    var totalPrice = 0;

    selectedServices['services'] = [];
    document.querySelectorAll('#selected_services_list .serviceitem').forEach((service, index) => {
        const name = service.querySelector('.service').textContent;
        const time = Number(service.querySelector('.duration').textContent.split(' ')[0]);
        const price = Number(service.querySelector('.price').textContent.replace('.', '').split(' ')[0]);
        const serviceObject = {};
        serviceObject['service' + index] = name;
        serviceObject['tid' + index] = time;
        serviceObject['pris' + index] = price;
        totalPrice += price;

        selectedServices['services'].push(serviceObject);
    });
    selectedServices['totalTime'] = TotalTimeOfYourBooking;
    selectedServices['totalPrice'] = totalPrice;
    return selectedServices;
}

var supabaseData = [];
function validateBooking() {
    if (!supabaseData) return true;

    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function doTimesOverlap(start1, end1, start2, end2) {
        return start1 < end2 && start2 < end1;
    }

    const selectedDate = stringToDateObject(datePicker.value + ' ' + timePicker.value).toISOString().split('T')[0];
    const yourStartMinutes = timeToMinutes(timePicker.value);
    const yourEndMinutes = yourStartMinutes + TotalTimeOfYourBooking;
    if(yourEndMinutes >= ((17 * 60) + 1)) {
        alert('Din tid er ude for kaldender');
        return false;
    }
    if(TotalTimeOfYourBooking <= 0){
        alert('Vælg venligst en service');
        return false;
    }
    let somethingIsBooked = false;

    supabaseData.forEach(element => {
        const bookingDate = element.start_time.split('T')[0];
        if (bookingDate !== selectedDate) return;

        const startTime = element.start_time.split('T')[1].slice(0, 5);
        const bookingStartMinutes = timeToMinutes(startTime);
        const bookingEndMinutes = bookingStartMinutes + element.duration;

        // CurrentBooking in minutes , CurrentBooking in minutes + duration --- Booking in minutes, Booking in minutes + duration
        if (doTimesOverlap(yourStartMinutes, yourEndMinutes, bookingStartMinutes, bookingEndMinutes)) {
            somethingIsBooked = true;
            alert('Denne tid eller noget af denne tid er allerede booket');
        }
    });

    //return true if 
    return !somethingIsBooked;
}



function renderServiceOptions(){
    const selector = document.getElementById("add_services");
    const services = fetch('pakker.json').then(response => response.json());

    services.then((data) => {
        data.forEach(service => {
            const option = document.createElement('option');
            option.value = service.label + '%' + service.duration + '%' + service.price + '%' + service.andtal_personer + '%' + service.inkl;
            option.textContent = service.label;
            selector.appendChild(option);
        });
    });
}

async function insertAllreadyBookedBookings(currentDate) {
    supabaseData = [];
    function getNextSunday(date = new Date()) {
        const daysUntilSunday = (7 - date.getDay()) % 7;
        date.setDate(date.getDate() + daysUntilSunday);
        date.setHours(23, 59, 59, 999);
        return date.toISOString();
    }
    
    function getPreviousMonday(date = new Date()) {
        const day = date.getDay();
        const daysSinceMonday = (day + 6) % 7;
        date.setDate(date.getDate() - daysSinceMonday + 1);
        date.setHours(0, 0, 0, 0);
        return date.toISOString();
    }

    const {access_token} = await signIn();    
    const requestBookingResponse = await fetch(`${supabaseUrl}/rest/v1/requestBooking?start_time=gte.${getPreviousMonday(currentDate)}&start_time=lte.${getNextSunday(currentDate)}&select=start_time,duration`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${access_token}`,
          'Prefer': 'return=representation'
        },
    });

    const requestBookingData = await requestBookingResponse.json();

    if (requestBookingResponse.ok) {
        requestBookingData.forEach((item) => {
            const day = new Date(item.start_time).toLocaleString('en', { weekday: 'long' }).toLowerCase();
            const start_time = item.start_time.split('T')[1].slice(0, -3);
            const duration = item.duration;
            supabaseData
            supabaseData.push(item);
            addTimeToKaldender(day, start_time, duration);
        })
    } else {
        console.error('Fetch failed:', requestBookingData);
    }

    const acceptedBookingResponse = await fetch(`${supabaseUrl}/rest/v1/acceptedBooking?start_time=gte.${getPreviousMonday(currentDate)}&start_time=lte.${getNextSunday(currentDate)}&select=start_time,duration`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${access_token}`,
          'Prefer': 'return=representation'
        },
    });

    const acceptedBookingData = await acceptedBookingResponse.json();

    if (acceptedBookingResponse.ok) {
        acceptedBookingData.forEach((item) => {
            const day = new Date(item.start_time).toLocaleString('en', { weekday: 'long' }).toLowerCase();
            const start_time = item.start_time.split('T')[1].slice(0, -3);
            const duration = item.duration;
            supabaseData.push(item);
            addTimeToKaldender(day, start_time, duration);
        })
    } else {
        console.error('Fetch failed:', acceptedBookingData);
    }
}