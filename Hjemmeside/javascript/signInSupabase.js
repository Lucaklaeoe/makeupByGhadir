const supabaseUrl = 'https://yuhqmzemazuzjkloasnr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1aHFtemVtYXp1emprbG9hc25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODk2OTYsImV4cCI6MjA2NDk2NTY5Nn0.HLlyHfiUTpwpCwiTsH-gfJgveMxpaKve5cyixuaALfc';
const DataFromSupaBase = {access_token: null, expires: null, logged_in_via: null};
async function signIn(email = "anonymous@example.com", password = "Guest1234") {

    if(DataFromSupaBase.access_token) return DataFromSupaBase;

    const user = JSON.parse(localStorage.getItem('user'));

    if(user && email == "anonymous@example.com") {
        if(user.expires > Date.now()) {
            DataFromSupaBase.access_token = user.access_token;
            DataFromSupaBase.expires = user.expires;
            DataFromSupaBase.logged_in_via = user.logged_in_via;

            return user;
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
        const saveDataForeLater = {access_token: data.access_token, expires: data.expires_in * 1000 + Date.now(), logged_in_via: data.user.email};
        localStorage.setItem('user', JSON.stringify(saveDataForeLater));

        DataFromSupaBase.access_token = saveDataForeLater.access_token;
        DataFromSupaBase.expires = saveDataForeLater.expires;
        DataFromSupaBase.logged_in_via = saveDataForeLater.logged_in_via;

        return saveDataForeLater;
    } else {
        console.error('Error signing in:', data);
    }
    return null;
}

function adminLogin(){
    async function loginPromt(){
        const email = prompt("Indtast din email");
        const password = prompt("Indtast dit password");
        return await signIn(email, password);
    }

    if(localStorage.getItem('user')) {
        const userdata = JSON.parse(localStorage.getItem('user'));
        if((userdata.logged_in_via == "anonymous@example.com" || userdata.expires < Date.now() ) ){
            return loginPromt();
        }
        else{
            return userdata;
        }
    }
    else {
        return loginPromt();
    }
}