const supabaseUrl = 'https://ijhfidvohtkcmpdhgzwz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqaGZpZHZvaHRrY21wZGhnend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDY4NjUsImV4cCI6MjA2MDg4Mjg2NX0.4-DicPttGvOJ30UFwvOONrkybrvCxP5dgqn5oEXo-Dk';
const signIn = async function signIn(email = "anonymous@example.com", password = "Guest1234") {
    if(localStorage.getItem('user')) {
        if(JSON.parse(localStorage.getItem('user')).expires_at <= Date.now()) {
            return JSON.parse(localStorage.getItem('user'));
        }
        else {
            localStorage.removeItem('user');
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
        const saveDataForeLater = {access_token: data.access_token, expires: data.expires_in + Date.now(), logged_in_via: data.user.email};
        localStorage.setItem('user', JSON.stringify(saveDataForeLater));
        return saveDataForeLater;
    } else {
        console.error('Error signing in:', data);
    }
    return null;
}