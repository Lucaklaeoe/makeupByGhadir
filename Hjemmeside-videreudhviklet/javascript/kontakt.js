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

    const recaptchaResponse = grecaptcha.getResponse();
    if (recaptchaResponse.length === 0) return_this = false;

    return return_this;
}

function sendMail(){
    emailjs.init("fYZvwmd-aKguwbHcg");
    const email_info = {
        name: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };
    emailjs.send('service_e039kf4', 'template_qba368l', email_info)
        .then(() => {
        //console.log('SUCCESS!');
        alert('Tak for din besked!');
        resetFields();
        }, (error) => {
        console.log('FAILED...', error);
        alert('Noget gik galt, prøv igen!');
    });
}

function resetFields(){
    document.getElementById("fullname").value = '';
    document.getElementById("email").value = '';
    document.getElementById("message").value = '';
    document.getElementById("sammentygge").checked = false;
}