// ============================================
// FIREBASE CONFIGURATION EXAMPLE
// ============================================
// 
// This file shows the structure of your Firebase config.
// DO NOT commit the actual firebase-config.js with real values to Git!
// 
// To get your actual values:
// 1. Go to Firebase Console: https://console.firebase.google.com/
// 2. Select your project
// 3. Click gear icon ⚙️ → Project settings
// 4. Scroll to "Your apps" section
// 5. Click the web icon </> (or select existing web app)
// 6. Copy the firebaseConfig object
// 7. Paste values into js/firebase-config.js
// ============================================

const firebaseConfig = {
    // Your Web API Key from Firebase Console
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    
    // Your Auth Domain (usually: your-project-id.firebaseapp.com)
    authDomain: "your-project-id.firebaseapp.com",
    
    // Your Project ID (same as project name)
    projectId: "your-project-id",
    
    // Your Storage Bucket (usually: your-project-id.appspot.com)
    storageBucket: "your-project-id.appspot.com",
    
    // Your Messaging Sender ID (numeric)
    messagingSenderId: "123456789012",
    
    // Your App ID
    appId: "1:123456789012:web:abcdef1234567890abcdef",
    
    // (Optional) Your Measurement ID - only if you enabled Google Analytics
    // measurementId: "G-XXXXXXXXXX"
};

// ============================================
// SECURITY BEST PRACTICES
// ============================================
// 
// 1. ✅ Add firebase-config.js to .gitignore if using Git
// 2. ✅ Never share your API keys publicly
// 3. ✅ Use Firebase Security Rules to protect data
// 4. ✅ Enable App Check for production (optional)
// 5. ✅ Set up Firebase budget alerts
// 
// Note: The API key is safe to expose in client-side code
// because Firebase security is enforced by Security Rules,
// not by hiding the API key.
// ============================================

// ============================================
// EXAMPLE: Real Firebase Config (Sample)
// ============================================
// 
// This is what a real config looks like (with fake values):
// 
// const firebaseConfig = {
//     apiKey: "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567",
//     authDomain: "doctor-manish-clinic.firebaseapp.com",
//     projectId: "doctor-manish-clinic",
//     storageBucket: "doctor-manish-clinic.appspot.com",
//     messagingSenderId: "987654321098",
//     appId: "1:987654321098:web:abc123def456ghi789jkl"
// };
// ============================================
