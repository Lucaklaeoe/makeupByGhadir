var BookingInfo = {};

document.addEventListener('DOMContentLoaded', () => {
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('change', (event) => {
            event.preventDefault();
            activateSubmitButton()
        })
    })

    const sammentygge = document.getElementById("sammentygge");
    sammentygge.addEventListener('change', (event) => {
        event.preventDefault();
        activateSubmitButton()
    })

    const make_booking = document.getElementById('make_booking');
    make_booking.addEventListener('click', (event) => {
        event.preventDefault();
        makeRequestBooking();
    })
})

function activateSubmitButton(){
        const submitButton = document.getElementById("make_booking");
        if(formIsFilled()){
            submitButton.classList.remove('disabled');
        }
        else {
            if(submitButton.classList.contains('disabled')) return;
            submitButton.classList.add('disabled');
        }
    }

function onRecaptchaSuccess() {
    if (formIsFilled()) {
        activateSubmitButton();
    }
}

function onRecaptchaExpired() {
    activateSubmitButton();
}

async function makeRequestBooking() {
    const {access_token, logged_in_via} = await signIn();
    //console.log(access_token);

    if(!fillFormAndCheck()) return;

    var response;
    
    if(logged_in_via == "anonymous@example.com") {
        publicResponse = await fetch(`${supabaseUrl}/rest/v1/currentPublicBookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${access_token}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify([{
                ...publicBookingInfo,
                bookingID: "Requested"
            }])
        });

        if(!publicResponse.ok){
            alert('Noget gik galt, prøv igen!');
            return;
        }
        const publicResponseJson = await publicResponse.json();
        response = await fetch(`${supabaseUrl}/rest/v1/requestBooking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify([{
                ...BookingInfo,
                bookingID: "R" + publicResponseJson[0].id
            }])
        });
        if(response.ok){
            sendMail();
            window.location = 'bookingConfirmed.html';
        }
        else{
            alert('Noget gik galt, prøv igen!');
        }
    }
    else{
        response = await fetch(`${supabaseUrl}/rest/v1/acceptedBooking`, {
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

        if(!response.ok){
            alert('Noget gik galt, prøv igen!');
            return;
        }
        const responseJson = await response.json();
        publicResponse = await fetch(`${supabaseUrl}/rest/v1/currentPublicBookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${access_token}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify([{
                ...publicBookingInfo,
                bookingID: "A" + responseJson[0].id
            }])
        });
        if(publicResponse.ok){
            sendMail();
            window.location = 'bookingConfirmed.html';
        }
        else{
            alert('Noget gik galt, prøv igen!');
        }
    }

    //const data = await response.json();
}

function formIsFilled(giveInfo = false) {
    const requiredFields = document.querySelectorAll('[required]');
    var return_this = true;
    requiredFields.forEach(field => {
        if(field.value.trim() == '' || field.value == null || field.value == undefined) {
            return_this = false;
            if(!field.classList.contains('not-filled') && giveInfo){
                field.classList.add('not-filled');
                field.addEventListener('input', () => {
                    field.classList.remove('not-filled');
                })
            };
        }
    });
    const sammentygge = document.getElementById("sammentygge");
    if(!sammentygge.checked){
        return_this = false;
        if(giveInfo) alert('Du skal godkende databeskyttelseslovgivning for at kunne booke');
    } 
    const recaptchaResponse = grecaptcha.getResponse();
    if (recaptchaResponse.length === 0) {
        return_this = false;
        if(giveInfo) alert('Husk at godkende at du ikke er en robot');
    }

    return return_this;
}

function fillFormAndCheck(giveMessage = true) {
    BookingInfo = {};

    if(!formIsFilled(giveMessage)) return false;

    const selectedServices = JSON.parse(localStorage.getItem('selectedservices'));

    if(!selectedServices){
        if(giveMessage) alert('Du mangler at vælge en service');
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
    publicBookingInfo = {
        "duration": duration,
        "start_time": start_time,
    }
    return true;
}

function sendMail(){
    emailjs.init("8on1XAeHXO55DA6Tp");
    const email_info = {
        name: document.getElementById("fullname").value,
        email: document.getElementById("email").value
    };
    emailjs.send('service_kesfnw1', 'template_h23bpoo', email_info)
        .then(() => {
        //console.log('SUCCESS!');
    }, (error) => {
        console.log('FAILED...', error);
    });
}