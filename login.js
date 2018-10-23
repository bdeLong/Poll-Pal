// Initialize Firebase
var config = {
  apiKey: "AIzaSyA_65abpPMuzwxk_LkmbvamOunnZhUjqSk",
  authDomain: "poll-pal-219318.firebaseapp.com",
  databaseURL: "https://poll-pal-219318.firebaseio.com",
  projectId: "poll-pal-219318",
  storageBucket: "poll-pal-219318.appspot.com",
  messagingSenderId: "846517490745"
};

firebase.initializeApp(config);

var database = firebase.database();


$("#login-button").on("click", function (event) {
  event.preventDefault();
  var email = $("#email").val().trim();
  var password = $("#password").val().trim();


  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    if (errorCode === 'auth/invalid-email' || errorCode === 'auth/user-disabled' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
      alert(errorCode)
    };
  });
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      window.location.replace("logged-in.html");
    }
  });

});

