// ============================================
// SUPABASE CONNECTION
// ============================================

const SUPABASE_URL = "https://qmlnhisiqyibyrpedmxx.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8XN0TGVlZ7IC7plY3O1TOQ_2FpUDSg_";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ============================================
// SIMPLE LOGIN
// ============================================

// CHANGE THESE PASSWORDS
const USERS = {
    Mini: "1330",
    Darius: "1330"
};

let currentUser = localStorage.getItem("plantUser");


// ============================================
// ELEMENTS
// ============================================

const loginScreen = document.getElementById("loginScreen");
const plantScreen = document.getElementById("plantScreen");

const miniButton = document.getElementById("miniButton");
const dariusButton = document.getElementById("dariusButton");

const passwordArea = document.getElementById("passwordArea");
const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");

const loginPrompt = document.getElementById("loginPrompt");
const loginMessage = document.getElementById("loginMessage");

const plantImage = document.getElementById("plantImage");
const plantStatus = document.getElementById("plantStatus");

const miniStatus = document.getElementById("miniStatus");
const dariusStatus = document.getElementById("dariusStatus");

const waterButton = document.getElementById("waterButton");
const message = document.getElementById("message");

const logoutButton = document.getElementById("logoutButton");


// ============================================
// LOGIN SCREEN
// ============================================

function showLoginScreen() {
    loginScreen.classList.remove("hidden");
    plantScreen.classList.add("hidden");

    passwordArea.classList.add("hidden");

    passwordInput.value = "";
    loginMessage.textContent = "";

    currentUser = null;
}


function showPlantScreen() {
    loginScreen.classList.add("hidden");
    plantScreen.classList.remove("hidden");

    loadPlant();
}


// ============================================
// SELECT USER
// ============================================

function selectUser(user) {
    currentUser = user;

    passwordArea.classList.remove("hidden");

    loginPrompt.textContent = `Password for ${user}`;

    passwordInput.value = "";
    loginMessage.textContent = "";

    passwordInput.focus();
}


// ============================================
// LOGIN
// ============================================

function login() {

    if (!currentUser) {
        loginMessage.textContent = "Choose who you are first.";
        return;
    }

    const enteredPassword = passwordInput.value;

    if (enteredPassword !== USERS[currentUser]) {

        loginMessage.textContent = "Wrong password.";

        passwordInput.value = "";
        passwordInput.focus();

        return;
    }

    // Remember who this browser belongs to
    localStorage.setItem("plantUser", currentUser);

    loginMessage.textContent = "";

    showPlantScreen();
}


// ============================================
// LOGOUT / SWITCH PERSON
// ============================================

function logout() {

    localStorage.removeItem("plantUser");

    showLoginScreen();
}


// ============================================
// SUPABASE: LOAD PLANT
// ============================================

async function loadPlant() {

    message.textContent = "Checking on the plant...";

    const { data, error } = await supabase
        .from("plant")
        .select("id, mini_last_watered, darius_last_watered")
        .eq("id", 1)
        .single();

    if (error) {

        console.error("Supabase error:", error);

        message.textContent =
            "Couldn't connect to the plant database.";

        return;
    }

    console.log("Plant data:", data);

    updatePlantDisplay(data);

    message.textContent = "";
}


// ============================================
// 24-HOUR CHECK
// ============================================

function isWateredWithin24Hours(timestamp) {

    if (!timestamp) {
        return false;
    }

    const wateredTime = new Date(timestamp).getTime();
    const now = Date.now();

    const twentyFourHours = 24 * 60 * 60 * 1000;

    return (now - wateredTime) < twentyFourHours;
}


// ============================================
// TIME DISPLAY
// ============================================

function getTimeSince(timestamp) {

    if (!timestamp) {
        return "Not watered";
    }

    const wateredTime = new Date(timestamp).getTime();
    const difference = Date.now() - wateredTime;

    const minutes = Math.floor(difference / (1000 * 60));

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days}d ago`;
}


// ============================================
// UPDATE PLANT DISPLAY
// ============================================

function updatePlantDisplay(data) {

    const miniWatered = isWateredWithin24Hours(
        data.mini_last_watered
    );

    const dariusWatered = isWateredWithin24Hours(
        data.darius_last_watered
    );


    // ----------------------------------------
    // PLANT CONDITION
    // ----------------------------------------

    if (miniWatered && dariusWatered) {

        plantImage.textContent = "🌹";

        plantStatus.textContent =
            "Both of you watered the plant. 🌹";

    } else {

        plantImage.textContent = "🥀";

        plantStatus.textContent =
            "The plant needs both of you.";

    }


    // ----------------------------------------
    // MINI STATUS
    // ----------------------------------------

    if (miniWatered) {

        miniStatus.textContent =
            `Watered ${getTimeSince(data.mini_last_watered)} ✓`;

    } else if (data.mini_last_watered) {

        miniStatus.textContent =
            "Needs water 🥀";

    } else {

        miniStatus.textContent =
            "Not watered";

    }


    // ----------------------------------------
    // DARIUS STATUS
    // ----------------------------------------

    if (dariusWatered) {

        dariusStatus.textContent =
            `Watered ${getTimeSince(data.darius_last_watered)} ✓`;

    } else if (data.darius_last_watered) {

        dariusStatus.textContent =
            "Needs water 🥀";

    } else {

        dariusStatus.textContent =
            "Not watered";

    }


    // ----------------------------------------
    // CURRENT USER'S BUTTON
    // ----------------------------------------

    const userAlreadyWatered =
        currentUser === "Mini"
            ? miniWatered
            : dariusWatered;


    if (userAlreadyWatered) {

        waterButton.disabled = true;

        waterButton.textContent =
            "Already watered 💧";

    } else {

        waterButton.disabled = false;

        waterButton.textContent =
            "Water the Plant 💧";

    }
}


// ============================================
// WATER THE PLANT
// ============================================

async function waterPlant() {

    if (!currentUser) {
        return;
    }

    waterButton.disabled = true;

    message.textContent =
        "Watering the plant...";


    const now = new Date().toISOString();

    let updateData = {};


    if (currentUser === "Mini") {

        updateData = {
            mini_last_watered: now
        };

    } else if (currentUser === "Darius") {

        updateData = {
            darius_last_watered: now
        };

    }


    const { data, error } = await supabase
        .from("plant")
        .update(updateData)
        .eq("id", 1)
        .select()
        .single();


    if (error) {

        console.error("Watering error:", error);

        message.textContent =
            "The plant refused the water. Check the database permissions.";

        waterButton.disabled = false;

        return;
    }


    console.log("Updated plant:", data);

    message.textContent =
        "The plant has been watered. 🌱";

    updatePlantDisplay(data);
}


// ============================================
// BUTTON EVENTS
// ============================================

miniButton.addEventListener("click", function () {
    selectUser("Mini");
});


dariusButton.addEventListener("click", function () {
    selectUser("Darius");
});


loginButton.addEventListener("click", function () {
    login();
});


passwordInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        login();
    }

});


waterButton.addEventListener("click", function () {
    waterPlant();
});


logoutButton.addEventListener("click", function () {
    logout();
});


// ============================================
// STARTUP
// ============================================

if (currentUser === "Mini" || currentUser === "Darius") {

    showPlantScreen();

} else {

    showLoginScreen();

}
