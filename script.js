// Reference to your Firebase Database location for the plant
const plantRef = database.ref('sharedPlant');

// Current plant status (can be seedling, sprout, mature plant, etc.)
let plantStatus = 'Seedling';

// Function to update the plant's status visually and in the database
function waterPlant() {
    // Update the plant status to the next growth stage
    if (plantStatus === 'Seedling') {
        plantStatus = 'Sprout';
        document.getElementById('plantStatus').innerText = "Plant Status: Sprout 🌱";
        document.getElementById('plantImage').src = 'sprout.png';
    } else if (plantStatus === 'Sprout') {
        plantStatus = 'Mature Plant';
        document.getElementById('plantStatus').innerText = "Plant Status: Mature Plant 🌳";
        document.getElementById('plantImage').src = 'mature.png';
    } else {
        alert("Your plant is already fully grown!");
        return;
    }

    // Sync the plant status with Firebase
    plantRef.set({
        status: plantStatus
    });
}

// Function to get the plant status when someone accesses it
function syncPlantData() {
    plantRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.status) {
            plantStatus = data.status;
            document.getElementById('plantStatus').innerText = `Plant Status: ${plantStatus}`;
            if (plantStatus === 'Seedling') {
                document.getElementById('plantImage').src = 'seedling.png';
            } else if (plantStatus === 'Sprout') {
                document.getElementById('plantImage').src = 'sprout.png';
            } else if (plantStatus === 'Mature Plant') {
                document.getElementById('plantImage').src = 'mature.png';
            }
        }
    });
}

// Call this function to sync the plant data across devices
syncPlantData();
