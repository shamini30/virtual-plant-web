/*
VIRTUAL PLANT
Supabase-connected version

```
This version:
- Connects to Supabase
- Reads the shared plant
- Shows who has watered
- Lets the current user water the plant

IMPORTANT:
Replace SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY
with the values from your Supabase project.
```

*/

// --------------------------------------------------
// SUPABASE CONNECTION
// --------------------------------------------------

const SUPABASE_URL = "https://qmlnhisiqyibyrpedmxx.supabase.co/rest/v1/";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_8XN0TGVlZ7IC7plY3O1TOQ_2FpUDSg_";

const supabase = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

// --------------------------------------------------
// TEMPORARY USER
// --------------------------------------------------

// For now we are pretending this browser belongs to Mini.
//
// Later we will replace this with proper authentication
// so Mini and Darius can have separate accounts.

const currentUser = "Mini";

// --------------------------------------------------
// HTML ELEMENTS
// --------------------------------------------------

const plantImage = document.getElementById("plantImage");
const plantStatus = document.getElementById("plantStatus");

const miniStatus = document.getElementById("miniStatus");
const dariusStatus = document.getElementById("dariusStatus");

const waterButton = document.getElementById("waterButton");
const message = document.getElementById("message");

// --------------------------------------------------
// GET PLANT DATA
// --------------------------------------------------

async function loadPlant() {

```
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
```

}

// --------------------------------------------------
// UPDATE THE PAGE
// --------------------------------------------------

function updatePlantDisplay(data) {

```
const miniWatered = data.mini_last_watered !== null;

const dariusWatered = data.darius_last_watered !== null;


// -----------------------------
// Plant appearance
// -----------------------------

if (miniWatered && dariusWatered) {

    plantImage.textContent = "🌹";

    plantStatus.textContent =
        "Both of you watered the plant. 🌹";

} else {

    plantImage.textContent = "🌱";

    plantStatus.textContent =
        "The plant is waiting for both of you.";

}


// -----------------------------
// Mini status
// -----------------------------

if (miniWatered) {

    miniStatus.textContent = "Watered ✓";

} else {

    miniStatus.textContent = "Not watered";

}


// -----------------------------
// Darius status
// -----------------------------

if (dariusWatered) {

    dariusStatus.textContent = "Watered ✓";

} else {

    dariusStatus.textContent = "Not watered";

}


// -----------------------------
// Button
// -----------------------------

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
```

}

// --------------------------------------------------
// WATER THE PLANT
// --------------------------------------------------

async function waterPlant() {

```
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

    console.error("Supabase update error:", error);

    message.textContent =
        "The plant refused the water. Check the database permissions.";

    waterButton.disabled = false;

    return;
}


console.log("Updated plant:", data);


message.textContent =
    "The plant has been watered. 🌱";


updatePlantDisplay(data);
```

}

// --------------------------------------------------
// START
// --------------------------------------------------

loadPlant();
