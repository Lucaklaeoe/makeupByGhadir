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
        weekDates.push(d.getDate() + ". " + d.toLocaleString('default', { month: 'short' }));    }
    
    return weekDates;
}

function renderWeek(date, setDatePicker = true) {
    const datePicker = document.getElementById('date_picker');

    if(setDatePicker) {
        const oneDayAhead = new Date(date);
        oneDayAhead.setDate(oneDayAhead.getDate() + 1);
        oneDayAhead.setHours(13, 0, 0, 0);
        datePicker.value = oneDayAhead.toISOString().slice(0, 16);
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
    span1.textContent = value[0];
    newService.appendChild(span1);
    span2 = document.createElement('span');
    span2.textContent = value[1];
    newService.appendChild(span2);
}

document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    const datePicker = document.getElementById('date_picker');
    datePicker.setAttribute('min', currentDate.toISOString().slice(0, 16));
    const servicePicker = document.getElementById('add_services');

    renderWeek(currentDate);

    document.getElementById('next_week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        renderWeek(currentDate);
    });
    document.getElementById('prev_week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        renderWeek(currentDate);
    });
    datePicker.addEventListener('change', () => {
        const selectedDate = new Date(datePicker.value);
        currentDate = selectedDate;
        renderWeek(currentDate, false);
    });
    datePicker.addEventListener('click', () => {
        datePicker.showPicker()
    })

    servicePicker.addEventListener('change', () => {
        const selectedService = servicePicker.value;
        addService(selectedService);
        servicePicker.value = 'default';
    })
})