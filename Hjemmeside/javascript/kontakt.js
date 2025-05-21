document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("send-message");
    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        if(!formIsFilled()) return;
        sendMail();
    })

    function activateSubmitButton() {
        if(formIsFilled()) {
            submitButton.classList.remove('disabled');
        }
        else {
            if(submitButton.classList.contains('disabled')) return;
            submitButton.classList.add('disabled');
        }
    }
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('change', (event) => {
            event.preventDefault();
            activateSubmitButton();
        })
    })

    // const sammentygge = document.getElementById("send-message");
    // sammentygge.addEventListener('change', (event) => {
    //     event.preventDefault();
    //     activateSubmitButton();
    // })
});

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

function sendMail(){
    alert('Beskeden vil blive sendt');
    /*
    emailjs.init("8on1XAeHXO55DA6Tp");
    const messageInfo = {
        name: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };
    emailjs.send('service_kesfnw1', 'template_h23bpoo', messageInfo)
        .then(() => {
        console.log('SUCCESS!');
    }, (error) => {
        console.log('FAILED...', error);
    });
    */
}