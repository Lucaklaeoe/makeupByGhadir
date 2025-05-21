function renderWeek(date) {

    if(document.getElementById('week').textContent.replace('Uge ', '') != getWeekNumber(date)) {
        document.querySelectorAll('.booking-time').forEach(time => {
            if(time.classList.contains('your-booking')) return;
            time.remove();
        })
        document.querySelectorAll('.booking-item').forEach(item => {
            item.remove();
        })

        insertBookings(date);
    }
    document.getElementById('week').textContent = "Uge " + getWeekNumber(date);
    
    getWeekDates(date).forEach((day, index) => {
        document.getElementById('date' + index).textContent = day;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const prevArrow = document.getElementById('prev_week');
    prevArrow.classList.add('arrow-disabled');
    const nextArrow = document.getElementById('next_week');
    let currentDate = new Date();
    const anmodningerTab = document.getElementById('anmodninger'); 
    const godkendteTab = document.getElementById('godkendte');

    anmodningerTab.addEventListener('click', () => {
        if(anmodningerTab.classList.contains('active-tab')) return;
        anmodningerTab.classList.add('active-tab');
        godkendteTab.classList.remove('active-tab');
        document.getElementById('requested').style.display = 'flex';
        document.getElementById('accepteret').style.display = 'none';
        calcHeightOnChildItems(document.getElementById('requested'));
    });
    godkendteTab.addEventListener('click', () => {
        if(godkendteTab.classList.contains('active-tab')) return;
        godkendteTab.classList.add('active-tab');
        anmodningerTab.classList.remove('active-tab');
        document.getElementById('requested').style.display = 'none';
        document.getElementById('accepteret').style.display = 'flex';
        calcHeightOnChildItems(document.getElementById('accepteret'));
    });

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
            insertBookingInfo(item, false);
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
        return `${hours}:${minutes}`
    }
}

function toEndTime(time, duration){
    const timeSplit = time.split(':');
    const hours = Number(timeSplit[0]) + Math.floor(duration / 60);
    const minutes = Number(timeSplit[1]) + (duration % 60);
    if(minutes == 0) return `${hours}:00`;
    return `${hours}:${minutes}`
}

function location_for_work(address){
    if(address == null || address.trim() == "," || address.trim() == "" || address == undefined) return "Ikke udfyldt";
    return address;
}

function acceptRejectButtons(requested){
    if(requested){
        return `
        <span class="reject-accept">
            <div class="reject">    
                <img src="svg/kryds.svg" alt="rejectBooking">
            </div>
            <div class="accept">
                <img src="svg/tjeck.svg" alt="acceptBooking">
            </div>
        </span>`;
    }
    else{
        return ``;
    }
}

function textArea(message){
    if(message == null || message.trim() == "" || message == undefined) return "";
    return `<textarea readonly class="message">${message}</textarea>`;
} 

function calcHeightOnChildItems(currentActiveTab){
    const bookingItems = currentActiveTab.querySelectorAll(".booking-item");
    bookingItems.forEach((item) => {
        calculateheight(item.id.replace("ADMIN", ""));
    })
}

function calculateheight(id){
    const item = document.getElementById("ADMIN"+id);
    if(item.classList.contains("calculated")) return;
    console.log(id);
    item.classList.add("calculated");
    const body = item.querySelector(".booking-body");
    const bodyHeight = body.getBoundingClientRect().height;

    const services = item.querySelector(".service");
    const servicesHeight = services.getBoundingClientRect().height;

    const name = item.querySelector(".name");
    const nameHeight = name.getBoundingClientRect().height;
    const location = item.querySelector(".location");
    const locationHeight = location.getBoundingClientRect().height;

    const height = Math.round(servicesHeight > nameHeight + locationHeight + 16 ? servicesHeight : nameHeight + locationHeight + 16);

    const arrow = item.querySelector(".arrow");

    arrow.addEventListener("click", () => {
        if(body.style.height == Math.round(height) + "px"){
            body.style.height = bodyHeight + "px";
            arrow.style.transform = "rotate(180deg)";
        }
        else{
            body.style.height = height + "px";
            arrow.style.transform = "rotate(0deg)";
        }
    })
    body.style.height = height + "px";
}

function insertBookingInfo(item, requested = true){
    const appendIn = requested ? document.getElementById('requested') : document.getElementById('accepteret');
    const id = requested ? "R" + item.id : "A" + item.id;
    const booking = `
    <div class="booking-item" id="ADMIN${id}">
        <div class="booking-header">
            <span>
                <p class="id">ID ${id}</p>
                <p class="make-bigger">${dateToString(item.start_time, false)}</p>
                <p class="make-bigger">Kl. ${dateToString(item.start_time, true)} - ${toEndTime(dateToString(item.start_time, true), item.duration)}</p>
            </span> 
            ${acceptRejectButtons(requested)}
        </div>
        <div class="booking-body">
            <div class="booking-info">
                <div class="services">
                    <p class="service">${serviceNameAndCounts(item.services)}</p>
                    ${textArea(item.message)}
                </div>
                <div>
                    <p>Adresse:</p>
                    <p>${item.adress}</p>
                </div>
            </div>
            <div class="booking-contact">
                <p class="name">${item.fulde_navn}</p>
                <div class="location">
                    <p>Udkørsel:</p>
                    <p>${location_for_work(item.location_for_work)}</p>
                </div>
                <div>
                    <p>Kontakt:</p>
                    <p>tlf. nr. ${item.tlf}</p>
                    <p>${item.email}</p>
                </div>
            </div>
        </div>
        <div class="arrow">
            <img src="svg/arrow-down.svg" alt="acceptBooking">
        </div>
    </div>`

    appendIn.insertAdjacentHTML('beforeend', booking);

    if(requested) setTimeout(() => calculateheight(id), 0);
    async function setChoiceButtons(id, bookingInfo){
        const {access_token} = await adminLogin();
        const bookingid = bookingInfo.id;
        delete bookingInfo.id;
        const item = document.getElementById("ADMIN"+id);
        const reject = item.querySelector(".reject");
        const accept = item.querySelector(".accept");

        async function deleteBooking(id) {
            const res = await fetch(`${supabaseUrl}/rest/v1/requestBooking?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${access_token}`,
                    'Prefer': 'return=representation'
                },
            });

            if (!res.ok) {
                console.error('Error deleting booking:', res.status, res.statusText);
            }

            return res.ok;
        }
        
        reject.addEventListener("click", async () => {
            if(await deleteBooking(bookingid)){
                item.remove();
                document.getElementById("R"+bookingid).remove();
                sendAfvidstMail(bookingInfo.fulde_navn, bookingInfo.email);
            }
        });

        accept.addEventListener("click", async () => {
            const acceptedBookingResponse = await fetch(`${supabaseUrl}/rest/v1/acceptedBooking`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${access_token}`,
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify([bookingInfo])
            });

            if(acceptedBookingResponse.ok){
                const insertedRow = (await acceptedBookingResponse.json())[0];
                insertBookingInfo(insertedRow, false);
                const day = new Date(insertedRow.start_time).toLocaleString('en', { weekday: 'long' }).toLowerCase();
                const start_time = insertedRow.start_time.split('T')[1].slice(0, -3);

                if(await deleteBooking(bookingid)){
                    item.remove();
                    document.getElementById("R"+bookingid).remove();
                    addTimeToKaldender(day, start_time, insertedRow.duration, false, "#1a2663", "A" + insertedRow.id);
                    sendGodkendtMail(insertedRow.fulde_navn, insertedRow.email, insertedRow.start_time.split('T')[0], start_time, serviceNameAndCounts(insertedRow.services));
                }
                else{
                    alert('Crital error, kontakt din administrator');
                }
            }
            else{
                alert('Noget gik galt, prøv igen eller genindlæs din browser');
            }
        });
    }
    if(requested) setTimeout(() => setChoiceButtons(id, item), 0);
}

function validateBooking(giveMessage = false) {
    if(giveMessage) alert('Booking auto valideret');
    return true;
}

function sendAfvidstMail(name, email) {
    emailjs.init("8on1XAeHXO55DA6Tp");
    const email_info = {
        name: name,
        email: email
    };
    emailjs.send('service_kesfnw1', 'template_odhfxvo', email_info)
        .then(() => {
        console.log('SUCCESS!');
        }, (error) => {
        console.log('FAILED...', error);
    });
}
function sendGodkendtMail(name, email, dato, tid, ydelse) {
    //alert('Beskeden vil blive sendt');
    
    emailjs.init("8on1XAeHXO55DA6Tp");
    const email_info = {
        name: name,
        email: email,
        dato: dato,
        tid: tid,
        ydelse: ydelse
    };

    console.log(email_info);

    /*
    emailjs.send('service_kesfnw1', 'template_odhfxvo', email_info)
        .then(() => {
        console.log('SUCCESS!');
        }, (error) => {
        console.log('FAILED...', error);
    });*/
    
}