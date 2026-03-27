
function validateLogin() {
    let username = document.querySelector("input[name='username']").value;
    let password = document.querySelector("input[name='password']").value;

    if (!username || !password) {
        alert("Enter username and password");
        return false;
    }

    return true;
}


// 🔹 REGISTER VALIDATION (FIXED)
function validateRegister() {
    let username = document.querySelector("input[name='username']").value;
    let password = document.querySelector("input[name='password']").value;
    let confirm = document.querySelector("input[name='confirm_password']").value;
    let email = document.querySelector("input[name='email']").value;
    let phone = document.querySelector("input[name='phone']").value;

    if (!username || !password || !confirm || !email || !phone) {
        alert("Fill all fields");
        return false;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return false;
    }

    if (phone.length < 10) {
        alert("Enter valid phone number");
        return false;
    }

    return true;
}


// 🔹 BOOKING VALIDATION (IMPROVED)
function validateBooking() {
    let names = document.querySelectorAll("input[name='name[]']");

    if (names.length === 0) {
        alert("Add at least one passenger");
        return false;
    }

    for (let i = 0; i < names.length; i++) {
        if (names[i].value.trim() === "") {
            alert("Enter all passenger names");
            return false;
        }
    }

    return true;
}


// 🔹 ADD PASSENGER (FIXED WITH REMOVE BUTTON)
function addPassenger() {
    let div = document.createElement("div");
    div.className = "passenger";

    div.innerHTML = `
        <input type="text" name="name[]" placeholder="Name">
        <input type="number" name="age[]" placeholder="Age">

        <select name="gender[]">
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
        </select>

        <select name="preference[]">
            <option>Lower</option>
            <option>Middle</option>
            <option>Upper</option>
            <option>Side Lower</option>
            <option>Side Upper</option>
        </select>

        <button type="button" onclick="removePassenger(this)">❌</button>
    `;

    document.getElementById("passenger-list").appendChild(div);
}


// 🔹 REMOVE PASSENGER
function removePassenger(btn) {
    let passenger = btn.parentElement;
    passenger.remove();
}


// 🔹 SWAP STATIONS
function swapStations() {
    let source = document.querySelector("input[name='source']");
    let destination = document.querySelector("input[name='destination']");

    [source.value, destination.value] = [destination.value, source.value];
}


// 🔹 AUTO DATE
document.addEventListener("DOMContentLoaded", function () {
    let dateInput = document.querySelector("input[name='date']");
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
});


// 🔹 CLASS SELECTION (MULTI TRAIN SAFE)
function selectClass(el, type) {

    let card = el.closest(".train-card");

    // remove active inside card only
    card.querySelectorAll(".classes span").forEach(e => {
        e.classList.remove("active");
    });

    el.classList.add("active");

    let data = {
        "SL": "AVAILABLE 45",
        "3A": "WL 15",
        "2A": "WL 3",
        "1A": "REGRET"
    };

    let availability = card.querySelector(".availability");
    availability.innerHTML = data[type];

    let btn = card.querySelector(".book-btn");

    if (data[type].includes("REGRET")) {
        btn.classList.add("disabled");
    } else {
        btn.classList.remove("disabled");
    }
}
