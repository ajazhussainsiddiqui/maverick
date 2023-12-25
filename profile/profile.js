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
  
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      displayUserInfo(user.uid);
    } else {
      // User is signed out
      console.log("User is signed out");
    }
  });
  
  function displayUserInfo(userId) {
    var userInfoContainer = document.getElementById('user-info');
  
    // Fetch user details from Firestore
    firestore.collection('users').doc(userId).get()
      .then(function (doc) {
        if (doc.exists) {
          // Display user details
          var userData = doc.data();
          userInfoContainer.innerHTML = `
            <p><strong>Name:</strong> ${userData.displayName}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <!-- Add more user details as needed -->
          `;
        } else {
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }
  
  
  function signOut() {
    auth.signOut().then(function () {
      // Sign-out successful, redirect to login page
      window.location.href = '/index.html'; // Update with your login page URL
    }).catch(function (error) {
      console.error('Sign Out Error', error);
    });
  }
  
  
  function searchUsers() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    var userList = document.getElementById('userList');
    userList.innerHTML = '';
  
    // Fetch all users from Firestore
    firestore.collection('users').get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var userData = doc.data();
          var displayName = userData.displayName.toLowerCase();
  
          // Display users whose names match the search input
          if (displayName.includes(searchInput)) {
            var listItem = document.createElement('li');
            listItem.textContent = userData.displayName;
            listItem.onclick = function () {
              openModal(userData.displayName);
            };
            userList.appendChild(listItem);
          }
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }
  
  function openModal(userName) {
    var modal = document.getElementById('messageModal');
    var modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = 'Send Message to ' + userName;
    modal.style.display = 'block';
  }
  
  function closeModal() {
    var modal = document.getElementById('messageModal');
    modal.style.display = 'none';
  }


  // Add the following code inside the existing `profile.js` file

function sendMessage() {
  var modalTitle = document.getElementById('modalTitle');
  var userName = modalTitle.textContent.replace('Send Message to ', '').trim();
  var messageInput = document.getElementById('messageInput').value;

  // Fetch the user ID of the recipient based on their display name
  firestore.collection('users').where('displayName', '==', userName).get()
    .then(function (querySnapshot) {
      if (!querySnapshot.empty) {
        var recipientUserId = querySnapshot.docs[0].id;

        // Save the message in Firestore
        firestore.collection('messages').add({
          sender: firebase.auth().currentUser.uid,
          recipient: recipientUserId,
          message: messageInput,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
          console.log('Message sent with ID: ', docRef.id);
          alert('Message sent!');
          closeModal();
        })
        .catch(function(error) {
          console.error('Error sending message: ', error);
        });
      } else {
        console.log('Recipient user not found.');
      }
    })
    .catch(function(error) {
      console.error('Error getting recipient user: ', error);
    });
}



// Add the following function to profile.js

function displayMessagesForUser(userId) {
  var messagesContainer = document.getElementById('messagesContainer');
  messagesContainer.innerHTML = ''; // Clear previous messages

  // Fetch messages for the given user ID
  firestore.collection('messages')
    .where('recipient', '==', userId)
    .orderBy('timestamp', 'desc') // Adjust the order as needed
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var messageData = doc.data();
        var senderUserId = messageData.sender;

        // Create a card for each message
        var messageCard = document.createElement('div');
        messageCard.classList.add('message-card');
        messageCard.innerHTML = `
          <p><strong>${messageData.message}</strong></p>
          <p><small>By:</small> ${senderUserId.substring(0,4)}</p>
          <p><small>at: ${new Date(messageData.timestamp.toDate()).toLocaleString()}</small></p>
        `;
        messagesContainer.appendChild(messageCard);
      });
    })
    .catch(function(error) {
      console.error('Error getting messages:', error);
    });
}

// Add the following line inside the auth.onAuthStateChanged callback to call the new function when the user is authenticated
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    displayMessagesForUser(user.uid);
    // ... (other code)
  } else {
    // User is signed out
    console.log("User is signed out");
  }
});

  