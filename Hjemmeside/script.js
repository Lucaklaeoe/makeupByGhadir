async function testrequest(){
    console.log("superbase test");
    
    const supabaseURL = 'https://ijhfidvohtkcmpdhgzwz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqaGZpZHZvaHRrY21wZGhnend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDY4NjUsImV4cCI6MjA2MDg4Mjg2NX0.4-DicPttGvOJ30UFwvOONrkybrvCxP5dgqn5oEXo-Dk';
    
    const infoobj = {
        "first_name": "luca-test",
        "last_name": "klæø-test",
        "email": "bonbonland@gmail.com test",
        "tlf": 12345678,
        "adress": "testvej 1",
        "start_time": "2023-01-01 12:00:00",
        "duration": 150,
        "location_for_work": "testvej 2",
        "message": "testtesttest"
    };

    const response = await fetch(supabaseURL + "/rest/v1/requestBooking", {
        method: "POST",
        headers: {
            "Authorization": supabaseKey,
            "apikey": supabaseKey,
            "Prefer": "return=representation",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(infoobj)
    });

    const data = await response.json();

    console.log(data);
}