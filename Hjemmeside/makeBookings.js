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


    
    const response = await fetch(`${supabaseUrl}/rest/v1/requestBooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${access_token}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify([{
          email: "anonymous@example.com",
          fulde_navn: "test",
          tlf: 12345678,
          adress: "testvej 1",
          start_time: "2023-01-01 12:00:00",
          duration: 150,
          location_for_work: "testvej 2",
          message: "testtesttest"
        }])
    });

    const data = await response.json();

    if (response.ok) {
        console.log('Row inserted:', data);
    } else {
        console.error('Insert failed:', data);
  }
}

function isFormFilled(){
    const requiredFields = document.querySelectorAll('[required]');
    BookingInfo = {};
    requiredFields.forEach(field => {
        if(field.value == '') {
            field.classList.add('not-filled');
        }
        else if(field.classList.contains('not-filled')) {
            field.classList.remove('not-filled');
        }
    });

    if(document.querySelector('.not-filled')) return false;

    const fulde_navn = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const tlf = document.getElementById("tlf").value;
    const start_time = document.getElementById("start_time").value;
    const duration = document.getElementById("duration").value;
    const message = document.getElementById("message").value || "";
    
    const adress = document.getElementById("autocomplete-adresse").value;
    const houseNumber = document.getElementById("autocomplete-house-number").value;
    const postalcode = document.getElementById("autocomplete-postal-code").value;
    const by = document.getElementById("autocomplete-by").value;

    const location_for_work = document.getElementById("location_for_work").value;

    BookingInfo = {
        email: email,
        fulde_navn: fulde_navn,
        tlf: tlf,
        adress: `${adress} ${houseNumber}`,
        start_time: start_time,
        duration: duration,
        adress: `${adress} ${houseNumber}, ${postalcode} ${by}`,
        location_for_work: "",
        message: message,
    }
    return true;
}

/*
email
fulde_navn 
tlf
adress
start_time
duration
location_for_work
message


*/