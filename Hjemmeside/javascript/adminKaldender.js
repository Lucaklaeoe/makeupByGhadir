function renderWeek(date) {
    if(document.getElementById('week').textContent.replace('Uge ', '') != getWeekNumber(date)) {
        document.querySelectorAll('.booking-time').forEach(time => {
            if(time.classList.contains('your-booking')) return;
            time.remove();
        })
        insertBookings(date);
    }
    document.getElementById('week').textContent = "Uge " + getWeekNumber(date);
    
    getWeekDates(date).forEach((day, index) => {
        document.getElementById('date' + index).textContent = day;
    })
}


document.addEventListener('DOMContentLoaded', async () => {
    const prevArrow = document.getElementById('prev_week');
    prevArrow.classList.add('arrow-disabled');
    const nextArrow = document.getElementById('next_week');
    let currentDate = new Date();

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
    renderWeek(currentDate);
})

var supabaseData = [];
async function insertBookings(currentDate) {
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

    const {access_token} = await adminLogin();
    const requestBookingResponse = await fetch(`${supabaseUrl}/rest/v1/requestBooking?start_time=gte.${getPreviousMonday(currentDate)}&start_time=lte.${getNextSunday(currentDate)}`, {
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
            addTimeToKaldender(day, start_time, duration, false, "#eeb579", "R" + item.id);
            //ADD TO KALDENDER GOKENDELSE LISTE
            insertBookingInfo(item);
        })
    } else {
        console.error('Fetch failed:', requestBookingData);
    }

    const acceptedBookingResponse = await fetch(`${supabaseUrl}/rest/v1/acceptedBooking?start_time=gte.${getPreviousMonday(currentDate)}&start_time=lte.${getNextSunday(currentDate)}`, {
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
            addTimeToKaldender(day, start_time, duration, false, "#1a2663", "A" + item.id);
            //ADD TO KALDENDER GODKENDTE LISTE
        })
    } else {
        console.error('Fetch failed:', acceptedBookingData);
    }
}

function serviceNameAndCounts(services) {
    const counts = {};

    services.forEach((item) => {
        counts[item.service] = (counts[item.service] || 0) + 1;
    });

    let returnString = '';
    for (const [service, count] of Object.entries(counts)) {
        returnString += `${service} x ${count} <br>`;
    }

    return returnString;
}

function dateToString(date, time = false) {
    date = new Date(date);
    if(!time){
        const day = date.getDate();
        const month = date.toLocaleString('en', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }
    else{
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `kl. ${hours}:${minutes}`
    }
}

function insertBookingInfo(item, requested = true){
    const appendIn = requested ? document.getElementById('requested') : document.getElementById('accepteret');
    const id = requested ? "R" + item.id : "A" + item.id;
    const booking = `
    <div class="booking-item">
        <div class="booking-header">
            <span>
                <p class="id">ID ${id}</p>
                <p>${dateToString(item.start_time)}</p>
                <p>${dateToString(item.start_time)}</p>
            </span>
            <span class="reject-accept">
                <div class="reject">    
                    <img src="svg/Kryds.svg" alt="rejectBooking">
                </div>
                <div class="accept">
                    <img src="svg/Tjeck.svg" alt="acceptBooking">
                </div>
            </span>
        </div>
        <div class="booking-body">
            <span>
                <div>
                    <p>${serviceNameAndCounts(item.services)}</p>
                    <p>${item.message}</p>
                </div>
                <div>
                    <p>Adresse:</p>
                    <p>${item.adress}</p>
                </div>
            </span>
            <span>
                <p>${item.name}</p>
                <div>
                    <p>Udkørsel:</p>
                    <p>${item.location_for_work}</p>
                </div>
                <div>
                    <p>Kontakt:</p>
                    <p>${item.tlf}</p>
                    <p>${item.email}</p>
                </div>
            </span>
        </div>
    </div>`

    appendIn.innerHTML += booking;
}