// Your Supabase URL and Anon Key
const supabaseUrl = 'https://ijhfidvohtkcmpdhgzwz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqaGZpZHZvaHRrY21wZGhnend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDY4NjUsImV4cCI6MjA2MDg4Mjg2NX0.4-DicPttGvOJ30UFwvOONrkybrvCxP5dgqn5oEXo-Dk';  // This is your public anon key, available in the API settings

async function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${supabaseUrl}/auth/v1/token`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey, // Include your Supabase anon key here
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
    });

    const data = await response.json();

    if (response.ok) {
    console.log('User signed in successfully:', data);
    } else {
    console.error('Error signing in:', data);
    }
}
