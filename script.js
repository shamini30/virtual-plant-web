// ============================================
// SIMPLE LOGIN
// ============================================

// CHANGE THESE TWO PASSWORDS
const USERS = {
    Mini: "1330",
    Darius: "1330"
};


// ============================================
// SUPABASE DETAILS
// ============================================

const SUPABASE_URL = "https://qmlnhisiqyibyrpedmxx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8XN0TGVlZ7IC7plY3O1TOQ_2FpUDSg_";


// Supabase will be created safely later.
// Login does NOT depend on it.
let supabaseClient = null;


// ============================================
// CURRENT USER
// ============================================

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
// CHECK THAT HTML ELEMENTS EXIST
// ============================================

console.log("Virtual Plant script loaded.");

console.log("Mini button:", miniButton);
console.log("Darius button:", dariusButton);
console.log("Password area:", passwordArea);


// ============================================
// SHOW LOGIN SCREEN
// ============================================

function showLoginScreen() {

    loginScreen.classList.remove("hidden");
    plantScreen.classList.add("hidden");

    passwordArea.classList.add("hidden");

    passwordInput.value = "";

    loginMessage.textContent = "";

    currentUser = null;
}


// ============================================
// SHOW PLANT SCREEN
// ============================================

function showPlantScreen() {

    loginScreen.classList.add("hidden");
    plantScreen.classList.remove("hidden");

    loadPlant();
}


// ============================================
// SELECT MINI / DARIUS
// ============================================

function selectUser(user) {

    console.log("Selected user:", user);

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

    console.log("Login attempt for:", currentUser);

    if (!currentUser) {

        loginMessage.textContent =
            "Choose who you are first.";

        return;
    }


    const enteredPassword = passwordInput.value;


    if (enteredPassword !== USERS[currentUser]) {

        loginMessage.textContent =
            "Wrong password.";

        passwordInput.value = "";

        passwordInput.focus();

        return;
    }


    console.log("Login successful:", currentUser);


    // Remember this person on this browser
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
// INITIALIZE SUPABASE
// ============================================

function initializeSupabase() {

    try {

        if (
            !window.supabase ||
            !window.supabase.createClient
        ) {

            console.error(
                "Supabase library did not load."
            );

            return false;
        }


        if (
            SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL" ||
            SUPABASE_PUBLISHABLE_KEY === "YOUR_SUPABASE_PUBLISHABLE_KEY"
        ) {

            console.error(
                "Supabase URL or publishable key has not been added."
            );

            return false;
        }


        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );


        console.log("Supabase connected.");

        return true;

    } catch (error) {

        console.error(
            "Could not initialize Supabase:",
            error
        );

        return false;
    }
}


// ============================================
// LOAD PLANT
// ============================================

async function loadPlant() {

    message.textContent =
        "Checking on the plant...";


    // Make sure Supabase is available
    if (!supabaseClient) {

        const connected =
            initializeSupabase();


        if (!connected) {

            message.textContent =
                "The plant database could not be reached.";

            return;
        }
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("plant")
        .select(
            "id, mini_last_watered, darius_last_watered"
        )
        .eq("id", 1)
        .single();


    if (error) {

        console.error(
            "Supabase load error:",
            error
        );

        message.textContent =
            "Couldn't connect to the plant database.";

        return;
    }


    console.log(
        "Plant data:",
        data
    );


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


    const wateredTime =
        new Date(timestamp).getTime();


    const now =
        Date.now();


    const twentyFourHours =
        24 * 60 * 60 * 1000;


    return (
        now - wateredTime <
        twentyFourHours
    );
}


// ============================================
// TIME SINCE WATERING
// ============================================

function getTimeSince(timestamp) {

    if (!timestamp) {
        return "Not watered";
    }


    const wateredTime =
        new Date(timestamp).getTime();


    const difference =
        Date.now() - wateredTime;


    const minutes =
        Math.floor(
            difference / (1000 * 60)
        );


    if (minutes < 1) {
        return "Just now";
    }


    if (minutes < 60) {
        return `${minutes}m ago`;
    }


    const hours =
        Math.floor(minutes / 60);


    if (hours < 24) {
        return `${hours}h ago`;
    }


    const days =
        Math.floor(hours / 24);


    return `${days}d ago`;
}


// ============================================
// UPDATE PLANT DISPLAY
// ============================================

function updatePlantDisplay(data) {

    const miniWatered =
        isWateredWithin24Hours(
            data.mini_last_watered
        );


    const dariusWatered =
        isWateredWithin24Hours(
            data.darius_last_watered
        );


    // ----------------------------------------
    // PLANT CONDITION
    // ----------------------------------------

    if (
        miniWatered &&
        dariusWatered
    ) {

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
            `Watered ${getTimeSince(
                data.mini_last_watered
            )} ✓`;

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
            `Watered ${getTimeSince(
                data.darius_last_watered
            )} ✓`;

    } else if (data.darius_last_watered) {

        dariusStatus.textContent =
            "Needs water 🥀";

    } else {

        dariusStatus.textContent =
            "Not watered";
    }


    // ----------------------------------------
    // CURRENT USER'S WATER BUTTON
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


    if (!supabaseClient) {

        const connected =
            initializeSupabase();


        if (!connected) {

            message.textContent =
                "The plant database could not be reached.";

            return;
        }
    }


    waterButton.disabled = true;

    message.textContent =
        "Watering the plant...";


    const now =
        new Date().toISOString();


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


    const {
        data,
        error
    } = await supabaseClient
        .from("plant")
        .update(updateData)
        .eq("id", 1)
        .select()
        .single();


    if (error) {

        console.error(
            "Watering error:",
            error
        );

        message.textContent =
            "The plant refused the water. Check the database permissions.";

        waterButton.disabled = false;

        return;
    }


    console.log(
        "Updated plant:",
        data
    );


    message.textContent =
        "The plant has been watered. 🌱";


    updatePlantDisplay(data);
}


// ============================================
// BUTTON EVENTS
// ============================================

// MINI
miniButton.addEventListener(
    "click",
    function () {

        selectUser("Mini");

    }
);


// DARIUS
dariusButton.addEventListener(
    "click",
    function () {

        selectUser("Darius");

    }
);


// LOGIN
loginButton.addEventListener(
    "click",
    function () {

        login();

    }
);


// PASSWORD ENTER KEY
passwordInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            login();

        }

    }
);


// WATER
waterButton.addEventListener(
    "click",
    function () {

        waterPlant();

    }
);


// SWITCH PERSON
logoutButton.addEventListener(
    "click",
    function () {

        logout();

    }
);


// ============================================
// STARTUP
// ============================================

if (
    currentUser === "Mini" ||
    currentUser === "Darius"
) {

    console.log(
        "Returning user:",
        currentUser
    );

    showPlantScreen();

} else {

    console.log(
        "No saved user. Showing login."
    );

    showLoginScreen();
}
