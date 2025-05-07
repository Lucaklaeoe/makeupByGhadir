const supabaseUrl = 'https://ijhfidvohtkcmpdhgzwz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqaGZpZHZvaHRrY21wZGhnend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDY4NjUsImV4cCI6MjA2MDg4Mjg2NX0.4-DicPttGvOJ30UFwvOONrkybrvCxP5dgqn5oEXo-Dk';
var BookingInfo = {};
async function signIn(email = "anonymous@example.com", password = "Guest1234") {
    if(localStorage.getItem('user')) {
        if(JSON.parse(localStorage.getItem('user')).expires_at <= Date.now()) {
            localStorage.removeItem('user');
        }
        else {
            return JSON.parse(localStorage.getItem('user'));
        }
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
    });

    const data = await response.json();

    if (response.ok) {
        //console.log('User signed in successfully:', data);
        const saveDataForeLater = {access_token: data.access_token, expires_at: data.expires_at + Date.now(), logged_in_via: data.user.email};
        localStorage.setItem('user', JSON.stringify(saveDataForeLater));
        return saveDataForeLater;
    } else {
        console.error('Error signing in:', data);
    }
    return null;
}

async function makeRequestBooking() {
    const {access_token} = await signIn();

    if(!fillFormAndCheck()) return;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/requestBooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${access_token}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify([{
            ...BookingInfo
        }])
    });

    const data = await response.json();

    if (response.ok) {
        console.log('Row inserted:', data);
    } else {
        console.error('Insert failed:', data);
  }
}

function fillFormAndCheck(){
    const requiredFields = document.querySelectorAll('[required]');
    BookingInfo = {};
    requiredFields.forEach(field => {
        if(field.value.trim() == '' || field.value == null || field.value == undefined) {
            field.classList.add('not-filled');
            field.addEventListener('input', () => {
                field.classList.remove('not-filled');
            })
        }
        else if(field.classList.contains('not-filled')) {
            field.classList.remove('not-filled');
        }
    });

    if(document.querySelector('.not-filled')) return false;

    const selectedServices = JSON.parse(localStorage.getItem('selectedservices'));
    if(!selectedServices){
        alert('Du mangler at vælge en service');
        window.location = 'booking.html';
        return false;
    }

    const email = document.getElementById("email").value;
    const fulde_navn = document.getElementById("fullname").value;
    const tlf = document.getElementById("tlf").value;
    const start_time = selectedServices.datetime;
    const duration = selectedServices.totalTime;

    const adress = document.getElementById("autocomplete_adresse").value;
    const houseNumber = document.getElementById("autocomplete_house_number").value;
    const postalcode = document.getElementById("autocomplete_postal_code").value;
    const by = document.getElementById("autocomplete_by").value;
    
    const udAdress = document.getElementById("ud_adress").value || "";
    const udHouseNumber = document.getElementById("ud_husnummer").value || "";
    const udPostalcode = document.getElementById("ud_postal_code").value || "";
    const udBy = document.getElementById("ud_by").value || "";

    const message = document.getElementById("message").value || "";
    const services = selectedServices.services;
    
    BookingInfo = {
        "email": email,
        "fulde_navn": fulde_navn,
        "tlf": tlf,
        "start_time": start_time,
        "duration": duration,
        "adress": `${adress} ${houseNumber}, ${postalcode} ${by}`,
        "location_for_work": `${udAdress} ${udHouseNumber}, ${udPostalcode} ${udBy}`,
        "message": message,
        "services": services,
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const make_booking = document.getElementById('make_booking');
    make_booking.addEventListener('click', (event) => {
        event.preventDefault();
        makeRequestBooking();
    })
})

/*
    email
    fulde_navn 
    tlf
    adress
    start_time
    duration
    location_for_work
    message
    services
*/