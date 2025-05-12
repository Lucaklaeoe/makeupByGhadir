var BookingInfo = {};

document.addEventListener('DOMContentLoaded', () => {
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', (event) => {
            event.preventDefault();
            if(formIsFilled()){
                const submitButton = document.getElementById("make_booking");
                submitButton.classList.remove('disabled');
            }
            else {
                const submitButton = document.getElementById("make_booking");
                if(submitButton.classList.contains('disabled')) return;
                submitButton.classList.add('disabled');
            }
        })
    })

    const sammentygge = document.getElementById("sammentygge");
    sammentygge.addEventListener('change', (event) => {
        event.preventDefault();
        if(formIsFilled()){
            const submitButton = document.getElementById("make_booking");
            submitButton.classList.remove('disabled');
        }
        else {
            const submitButton = document.getElementById("make_booking");
            if(submitButton.classList.contains('disabled')) return;
            submitButton.classList.add('disabled');
        }
    })
})

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
        //console.log('Row inserted:', data);
        window.location = 'bookingConfirmed.html';
        sendMail();
    } else {
        alert('Noget gik galt, prøv igen');
  }
}

function formIsFilled() {
    const requiredFields = document.querySelectorAll('[required]');
    var return_this = true;
    requiredFields.forEach(field => {
        if(field.value.trim() == '' || field.value == null || field.value == undefined) {
            return_this = false;
        }
    });
    const sammentygge = document.getElementById("sammentygge");
    if(!sammentygge.checked) return_this = false;
    return return_this;
}

function fillFormAndCheck(giveMessage = true) {
    BookingInfo = {};
    const requiredFields = document.querySelectorAll('[required]');
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

    const sammentygge = document.getElementById("sammentygge");
    if(!sammentygge.checked) return false;

    if(document.querySelector('.not-filled')) return false;

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
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const make_booking = document.getElementById('make_booking');
    make_booking.addEventListener('click', (event) => {
        event.preventDefault();
        makeRequestBooking();
    })
})

function sendMail(){
    emailjs.init("8on1XAeHXO55DA6Tp");
    const email_info = {
        name: document.getElementById("fullname").value,
        email: document.getElementById("email").value
    };
    emailjs.send('service_kesfnw1', 'template_h23bpoo', email_info)
        .then(() => {
        console.log('SUCCESS!');
        }, (error) => {
        console.log('FAILED...', error);
    });
}