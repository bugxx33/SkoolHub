import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVQ9Eit9fH2FcPE1TMbTjH-kQ4FVfpakY",
    authDomain: "sde-project-ed3ed.firebaseapp.com",
    databaseURL: "https://sde-project-ed3ed-default-rtdb.firebaseio.com",
    projectId: "sde-project-ed3ed",
    storageBucket: "sde-project-ed3ed.appspot.com",
    messagingSenderId: "602222350958",
    appId: "1:602222350958:web:90fbe6e91c0f257a2c4c7f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.onload = function() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.querySelector('.wrapper-2').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('firstName').textContent = user.firstName || "N/A";
        document.getElementById('lastName').textContent = user.lastName || "N/A";
        document.getElementById('department').textContent = user.department || "N/A";
        document.getElementById('college').textContent = user.college || "N/A";
        document.getElementById('idNumber').textContent = user.idNumber || "N/A";

        const userRef = ref(database, `users credentials/${user.idNumber}`); 
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    console.log("User data retrieved from Firebase:", userData);

                    document.getElementById('contactNumber').textContent = userData.contactNumber || "N/A";
                    document.getElementById('emailAddress').textContent = userData.emailAddress || "N/A"; 
                    
                    const profileURL = userData.profileURL;
                    if (profileURL) {
                        document.getElementById('profilePicture').src = profileURL;
                    } else {
                        console.log("Profile picture URL not found.");
                        document.getElementById('profilePicture').alt = "No profile picture available";
                    }
                } else {
                    console.log("No data found for the specified user ID.");
                    document.getElementById('contactNumber').textContent = "No data available";
                    document.getElementById('emailAddress').textContent = "No data available";
                }
            })
            .catch((error) => {
                console.error("Error fetching data from Firebase:", error);
                document.getElementById('contactNumber').textContent = "Error loading data";
                document.getElementById('emailAddress').textContent = "Error loading data";
            });
    } else {
        console.log("No user data found in localStorage.");
        document.querySelector('.wrapper-2').textContent = "No user data found.";
        const fields = ['firstName', 'lastName', 'department', 'college', 'contactNumber', 'idNumber', 'emailAddress'];
        fields.forEach(field => {
            document.getElementById(field).textContent = "No data available";
        });
    }
};

document.getElementById('editHeader').addEventListener('click', function() {
    const fields = ['firstName', 'lastName', 'idNumber', 'department', 'college', 'contactNumber', 'emailAddress'];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element.getAttribute('contenteditable') === 'false') {
            element.setAttribute('contenteditable', 'true'); 
            element.classList.add('editable');  
        } else {
            element.setAttribute('contenteditable', 'false'); 
            element.classList.remove('editable'); 
        }
    });
});

document.getElementById('save').addEventListener('click', () => {
    localStorage.setItem('user'); 
});
