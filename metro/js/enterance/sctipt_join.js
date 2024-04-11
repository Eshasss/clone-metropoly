function check_field_empty(field_id) {
    const field = document.getElementById(field_id);
    const field_vlaue = field.value;

    if (!field_vlaue) {
        field.style.boxShadow = "0 0 10px 5px #5e2538";
        return false;
    }
    field.style.boxShadow = "";
    return true;
}

document.getElementById("login_button") = function () {
    const fields_id = ["nick", "email", "password"];
    let is_form_full = true;

    fields_id.forEach(field_id => {
        is_form_full = is_form_full && check_field_empty(field_id);
    });

    // if the form was not filled fully
    if (!is_form_full) {
        return;
    }

    const user_email = document.getElementById("email").value;
    const user_password = document.getElementById("password").value;
    const user_nick = document.getElementById("nick").value;

    // check user password and email
    const url = "http://localhost:8000/add-user/";
    let status;

    fetch(url, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "email": user_email,
            "password": user_password
        }),
    })
        .then((response) => {
            status = response.status;
            return response.text();
        })
        .then((text) => JSON.parse(text))
        .then((json) => check_user(json, status))
        .catch((error) => console.log(error));
}

function check_user(json, status) {
    if (status == 200) {
        // status OK
        let accepted = json.accepted;
        if (accepted) {
            // get token and user id
            sessionStorage.setItem("user_id", json.id);
            sessionStorage.setItem("token", json.token);

            window.location.replace("http://localhost:8000/home");
        }
        else {
            document.getElementById("error_field").value = "Uncorrect password";
        }
    }
    else {
        document.getElementById("error_field").value = "User with this email was not found";
    }
}

document.getElementById("registration_button") = function() {
    window.location.replace("http://localhost:8000/registration/")
}
