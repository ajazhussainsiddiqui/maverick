var firebaseConfig = {
  apiKey: "AIzaSyAbPrqXYpWr-rfpMCoqo-k1MRYG8-oQYeg",
  authDomain: "messaging-af674.firebaseapp.com",
  projectId: "messaging-af674",
  storageBucket: "messaging-af674.appspot.com",
  messagingSenderId: "782623052324",
  appId: "1:782623052324:web:ba651fadcc8289bb12beb1"
};


firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var firestore = firebase.firestore();

function signIn() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      // Signed in
      var user = userCredential.user;
      // Fetch user details from Firestore
      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {
          if (doc.exists) {
            // User details found, redirect to profile page
            window.location.href = 'profile/profile.html'; // Update with your profile page URL
          } else {
            console.log('No such document!');
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error);
        });
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(errorMessage);
    });
}

function googleSignIn() {
  // Implement Google sign-in logic here
}
