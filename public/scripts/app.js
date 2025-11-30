// **[CRITICAL]: REPLACE THE ENTIRE CONFIG OBJECT BELOW WITH YOUR ACTUAL FIREBASE CONFIG**
const firebaseConfig = {
    apiKey: "AIzaSyD4yyh23ifKf18YELx1riE58SgbbjvBeOE",
    authDomain: "attendance-system-2025-3e69b.firebaseapp.com",
    projectId: "attendance-system-2025-3e69b",
    storageBucket: "attendance-system-2025-3e69b.firebasestorage.app",
    messagingSenderId: "1058570851330",
    appId: "1:1058570851330:web:d4b88625bcc0b335a0831b"
  };

// Initialize Firebase and Services
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore(); // Initializing Firestore for Cloud Storage

console.log("Firebase App, Auth, and Firestore Initialized.");

// DOM Element References (Inputs and Authentication)
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const userEmailSpan = document.getElementById('user-email');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const errorMessage = document.getElementById('error-message');

// ... (existing references) ...
const reportBtn = document.getElementById('report-btn');
const attendanceReportSection = document.getElementById('attendance-report');
const attendanceBody = document.getElementById('attendance-body');
const reportMessage = document.getElementById('report-message');

// DOM Element References (Attendance)
const markAttendanceBtn = document.getElementById('mark-attendance-btn');
const statusMessage = document.getElementById('status-message');

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Authentication Functions Implementation (Key Feature: User Authentication) ---

// Function to handle sign up
const handleSignUp = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = ''; 

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters.';
        return;
    }

    try {
        errorMessage.textContent = 'Creating user...';
        // 1. Create the user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 2. Create a user document in Firestore (for profile/role management)
        await db.collection('users').doc(user.uid).set({
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            role: 'team-member' // Default role
        });

        errorMessage.textContent = `User ${user.email} signed up and logged in successfully!`;
        console.log("New user registered and user document created in Firestore.");

    } catch (error) {
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/email-already-in-use') {
            message = 'This email is already registered. Try logging in.';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Please enter a valid email address.';
        } else if (error.code === 'auth/weak-password') {
            message = 'Password is too weak. Must be at least 6 characters.';
        } else {
            message = `Error signing up: ${error.message}`;
        }
        errorMessage.textContent = message;
        console.error("Sign Up Error:", error);
    }
};

// Function to handle login
const handleLogin = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = ''; 

    try {
        errorMessage.textContent = 'Logging in...';
        await auth.signInWithEmailAndPassword(email, password);
        
        // auth.onAuthStateChanged handles the UI update automatically

    } catch (error) {
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = 'Invalid email or password.';
        } else {
            message = `Error logging in: ${error.message}`;
        }
        errorMessage.textContent = message;
        console.error("Login Error:", error);
    }
};

// Function to handle logout
const handleLogout = async () => {
    try {
        await auth.signOut();
        // auth.onAuthStateChanged handles the UI update automatically
        console.log("User signed out.");
        // Clear inputs for security
        emailInput.value = '';
        passwordInput.value = '';
        statusMessage.textContent = ''; // Clear status on logout
    } catch (error) {
        errorMessage.textContent = `Error logging out: ${error.message}`;
        console.error("Logout Error:", error);
    }
};

// Function to check if the user has already marked attendance today
const updateAttendanceStatus = async (uid) => {
    const todayDate = getTodayDateString();
    
    try {
        // Query Firestore for attendance marked by this user today
        const attendanceRef = db.collection('attendance_records').doc(uid);
        const doc = await attendanceRef.get();

        if (doc.exists && doc.data().attendance[todayDate]) {
            // Attendance found for today: Disable button and show status
            markAttendanceBtn.disabled = true;
            statusMessage.textContent = `Status: Attendance already marked for ${todayDate}.`;
        } else {
            // No attendance found for today: Enable button
            markAttendanceBtn.disabled = false;
            statusMessage.textContent = 'Status: Ready to mark attendance.';
        }
    } catch (error) {
        statusMessage.textContent = 'Error checking attendance status.';
        console.error("Error checking attendance status:", error);
    }
};

// 1. Authentication State Observer: Manages UI based on login status
auth.onAuthStateChanged(user => {
    if (user) {
        // User is logged in
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        userEmailSpan.textContent = user.email; 
        errorMessage.textContent = '';
        
        // VITAL CHANGE: Call the function to set button state on login
        updateAttendanceStatus(user.uid); // <--- ADD THIS LINE

    } else {
        // User is logged out
        authSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        userEmailSpan.textContent = '';
    }
});


// Event Listeners (Connects buttons to functions)
signupBtn.addEventListener('click', handleSignUp);
loginBtn.addEventListener('click', handleLogin);
logoutBtn.addEventListener('click', handleLogout);


// Function to handle Marking Attendance
const handleMarkAttendance = async () => {
    const user = auth.currentUser;
    if (!user) {
        statusMessage.textContent = 'Error: Please log in first.';
        return;
    }
    
    const todayDate = getTodayDateString();

    try {
        statusMessage.textContent = 'Marking attendance...';
        
        // Use the user's UID as the document ID for efficient lookup and security
        const attendanceRef = db.collection('attendance_records').doc(user.uid);

        await attendanceRef.set({
            // Use set with merge: true to update only the attendance map for today
            email: user.email,
            uid: user.uid,
            attendance: {
                [todayDate]: firebase.firestore.FieldValue.serverTimestamp() // Records presence time
            }
        }, { merge: true }); // Merge ensures other dates are not overwritten

        statusMessage.textContent = 'Attendance marked successfully!';
        
        // Update the buttons based on the new status
        updateAttendanceStatus(user.uid); 

    } catch (error) {
        statusMessage.textContent = `Error marking attendance: ${error.message}`;
        console.error("Mark Attendance Error:", error);
    }
};


// Function to fetch and display the attendance report
const generateReport = async () => {
    const user = auth.currentUser;
    if (!user) return; // Should not happen if button is shown correctly

    // Show the report section and loading message
    attendanceReportSection.style.display = 'block';
    reportMessage.textContent = 'Loading attendance history...';
    attendanceBody.innerHTML = ''; // Clear previous report

    try {
        const docRef = db.collection('attendance_records').doc(user.uid);
        const doc = await docRef.get();

        if (doc.exists && doc.data().attendance) {
            const records = doc.data().attendance;
            const dates = Object.keys(records).sort().reverse(); // Sort dates descending

            if (dates.length === 0) {
                reportMessage.textContent = 'No attendance records found.';
                return;
            }

            let html = '';
            dates.forEach(date => {
                const timestamp = records[date];
                // Convert Firestore Timestamp to readable time string
                const timeString = timestamp.toDate().toLocaleTimeString();

                html += `
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 8px;">${date}</td>
                        <td style="border: 1px solid #ccc; padding: 8px; color: green; font-weight: bold;">PRESENT</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${timeString}</td>
                    </tr>
                `;
            });
            
            attendanceBody.innerHTML = html;
            reportMessage.textContent = `Report generated successfully. Total days: ${dates.length}.`;
            
        } else {
            reportMessage.textContent = 'No attendance history found.';
        }
    } catch (error) {
        reportMessage.textContent = `Error generating report: ${error.message}`;
        console.error("Report Error:", error);
    }
};

// Attendance Event Listeners (Functional)
markAttendanceBtn.addEventListener('click', handleMarkAttendance);
reportBtn.addEventListener('click', generateReport); // <-- ADD THIS LINE