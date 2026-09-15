/*
TEMPORARY LOCAL VERSION

```
This is NOT connected to Supabase yet.

We are using this just to test the website interface
before connecting the database.
```

*/

// Temporary local data
let plantData = {
miniWatered: false,
dariusWatered: false
};

// Change this later when we add proper login/authentication
// For now, you can test both people from the browser console.
let currentUser = "Mini";

// Get HTML elements
const plantImage = document.getElementById("plantImage");
const plantStatus = document.getElementById("plantStatus");

const miniStatus = document.getElementById("miniStatus");
const dariusStatus = document.getElementById("dariusStatus");

const waterButton = document.getElementById("waterButton");
const message = document.getElementById("message");

// Update the plant based on current data
function updatePlant() {

```
if (plantData.miniWatered && plantData.dariusWatered) {

    plantImage.textContent = "🌹";

    plantStatus.textContent =
        "The plant is happy. Both of you watered it. 🌹";

} else {

    plantImage.textContent = "🌱";

    plantStatus.textContent =
        "The plant is waiting for both of you.";

}


// Update Mini's status
if (plantData.miniWatered) {

    miniStatus.textContent = "Watered ✓";

} else {

    miniStatus.textContent = "Not watered";

}


// Update Darius's status
if (plantData.dariusWatered) {

    dariusStatus.textContent = "Watered ✓";

} else {

    dariusStatus.textContent = "Not watered";

}


// Disable button if current user already watered
if (
    (currentUser === "Mini" && plantData.miniWatered) ||
    (currentUser === "Darius" && plantData.dariusWatered)
) {

    waterButton.disabled = true;

    waterButton.textContent = "Already watered 💧";

} else {

    waterButton.disabled = false;

    waterButton.textContent = "Water the Plant 💧";

}
```

}

// Water the plant
function waterPlant() {

```
if (currentUser === "Mini") {

    if (plantData.miniWatered) {

        message.textContent = "You already watered the plant.";

        return;
    }

    plantData.miniWatered = true;

    message.textContent =
        "Mini watered the plant. Now we wait for Darius. 🌱";

}


else if (currentUser === "Darius") {

    if (plantData.dariusWatered) {

        message.textContent = "You already watered the plant.";

        return;
    }

    plantData.dariusWatered = true;

    message.textContent =
        "Darius watered the plant. 🌱";

}


updatePlant();
```

}

// Run when page loads
updatePlant();
