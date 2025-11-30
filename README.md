# Cloud Attendance System 2025

A modern, cloud-based attendance tracking system built with Firebase, designed to help organizations manage employee attendance efficiently and securely.

## 🚀 Features

- **User Authentication**: Secure sign-up and login system using Firebase Authentication
- **Daily Attendance Marking**: Simple one-click attendance marking with real-time status updates
- **Attendance History**: Comprehensive reporting system showing attendance records with timestamps
- **Responsive Design**: Clean, mobile-friendly interface that works on all devices
- **Real-time Data**: Instant synchronization across all user sessions using Firestore
- **Secure Data Storage**: All attendance data stored securely in the cloud with Firebase Firestore

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase (Authentication, Firestore Database, Hosting)
- **Deployment**: Firebase Hosting
- **Database**: Cloud Firestore (NoSQL)

## 📋 Prerequisites

Before running this project, make sure you have:

- A Google account
- Node.js and npm installed (for Firebase CLI)
- A Firebase project set up

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd attendance-sys-2025
   ```

2. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase**:
   ```bash
   firebase login
   ```

4. **Set up your Firebase project**:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Hosting

5. **Update Firebase Configuration**:
   - Open `public/scripts/app.js`
   - Replace the `firebaseConfig` object with your Firebase project's configuration
   - Update `.firebaserc` with your project ID

6. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

## 📖 Usage

1. **Access the Application**: Open your deployed Firebase Hosting URL
2. **Sign Up**: Create a new account with your email and password
3. **Mark Attendance**: Click the "Mark Attendance" button to record your daily attendance
4. **View Reports**: Click "Generate Report" to view your attendance history
5. **Logout**: Securely sign out when finished

## 📁 Project Structure

```
attendance-sys-2025/
├── public/
│   ├── index.html          # Main application interface
│   ├── scripts/
│   │   └── app.js          # Application logic and Firebase integration
│   └── 404.html            # Custom 404 page
├── firebase.json           # Firebase project configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore database indexes
├── .firebaserc            # Firebase project settings
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## 🔒 Security Notes

⚠️ **Important**: The current Firestore security rules are set to expire on December 30, 2025. Before this date:

1. Review and update `firestore.rules` with appropriate security rules for production use
2. Ensure proper authentication checks are in place
3. Test all security rules thoroughly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 📞 Support

If you encounter any issues or have questions about this project, please open an issue on the GitHub repository.

---

**Built with ❤️ using Firebase**