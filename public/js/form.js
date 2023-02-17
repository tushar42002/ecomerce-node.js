window.onload = () => {
    if(sessionStorage.user){
        user = JSON.parse(sessionStorage.user);
        if(user.email){
            location.replace('/');
        }
    }
}

// form
let formBtn = document.querySelector('.submit-btn');
let loader = document.querySelector('.loader');

formBtn.addEventListener('click', () => {
    let fullname = document.querySelector('#name') || null;
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let number = document.querySelector('#number') || null;
    let tac = document.querySelector('#tc') || null;

    if(fullname != null){
        // form validate
        if (fullname.length < 3) {
            showFormError("name must be 3 letters long ")
    
        } else if (!email) {
            showFormError(" enter valid email ")
    
        } else if (password.length < 8) {
            showFormError("password must have 8 letters ")
    
        } else if (Number(number) || number.length < 10) {
            showFormError(" enter valid mobile no. ")
        } else if (!tac.checked) {
            showFormError(" plese agree to our term and condition ")
        } else {

            loader.style.display = 'block';
            sendData('/signup', {
                name: fullname.value,
                email: email.value,
                password: password.value,
                number: number.value,
                tac: tac.checked
            })
        }
    } else {
        // login 
        if(!email.value.length || !password.value.length){
            showFormError('fill all inputs');
        } else{
            // submit form
            loader.style.display = 'block';
            sendData('/signup', {
                email: email.value,
                password: password.value
            })
        }
    }

    


})
