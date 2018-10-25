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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    window.location.replace("logged-in.html");
  }
});

$("#submit-button").on("click", function (event) {
  event.preventDefault();
  var name = $("#name").val().trim();
  var password = $("#password").val().trim();
  var passwordConfirm = $("#password-confirm").val().trim();
  var email = $("#email").val().trim();
  var address = $("#address").val().trim();

  if (name !== "" && password !== "" && password === passwordConfirm && email !== "") {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/weak-password' || errorCode === 'auth/email-already-in-use' || errorCode === 'auth/invalid-email' || errorCode === 'auth/operation-not-allowed') {
        bootbox.alert(errorCode + " : " + errorMessage);
      };
    });
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var uid = user.uid;
        console.log(email, uid);
        database.ref("users/" + uid).set({
          name,
          address
        })
        $("#name").val("")
        $("#password").val("")
        $("#password-confirm").val("")
        $("#email").val("")
        $("#address").val("");
        setTimeout(function () {
          window.location.replace("logged-in.html");
        }, 2000);
      }
    });

  }
  else if (password !== passwordConfirm) {
    bootbox.alert("Passwords do not match!");
  }
});