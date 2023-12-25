const firebaseConfig = {
  apiKey: "AIzaSyAbPrqXYpWr-rfpMCoqo-k1MRYG8-oQYeg",
  authDomain: "messaging-af674.firebaseapp.com",
  projectId: "messaging-af674",
  storageBucket: "messaging-af674.appspot.com",
  messagingSenderId: "782623052324",
  appId: "1:782623052324:web:ba651fadcc8289bb12beb1"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore(); // Initialize Firestore

function registerUser() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var displayName = document.getElementById("displayName").value;
  var errorMessageElement = document.getElementById("error-message");

  // Check if email is already registered
  firebase.auth().fetchSignInMethodsForEmail(email).then(function(signInMethods) {
    if (signInMethods.length === 0) {
      // Email is not registered, proceed with registration
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
          var user = userCredential.user;
          
          // Update user profile with display name
          user.updateProfile({
            displayName: displayName
          }).then(function() {
            document.getElementById("success-message").textContent = "Registration successful! Redirecting to the login page...";
            
             setTimeout(function() {
               window.location.href = "/login/index.html";
              }, 3000); // Redirect another page after 3 seconds 

            // Add user data to Firestore
            db.collection("users").doc(user.uid).set({
              email: user.email,
              displayName: user.displayName
            }).then(function() {
              console.log("Data added to Firestore");
            }).catch(function(error) {
              console.error("Error adding data to Firestore:", error);
            });
          }).catch(function(error) {
            console.error("Error setting display name:", error);
          });
        })
        .catch(function(error) {
          console.error("Error creating user:", error);
        });
    } else {
      // If Email is already registered, display an error message
      errorMessageElement.textContent = "Email is already registered";
    }
  }).catch(function(error) {
    console.error("Error checking email:", error);
  });
}
