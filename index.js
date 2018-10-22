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

$("#submit-button").on("click", function (event) {
  event.preventDefault();
  var name = $("#name").val().trim();
  var password = $("#password").val().trim();
  var passwordConfirm = $("#password-confirm").val().trim();
  var email = $("#email").val().trim();

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === 'auth/weak-password' || errorCode === 'auth/email-already-in-use' || errorCode === 'auth/invalid-email' || errorCode === 'auth/operation-not-allowed') {
      alert(errorMessage);
    };
  });

  if (name !== "" && password !== "" && password === passwordConfirm && email !== "") {
    database.ref().set({
      name
    });
    // window.location.replace("site.html");
  }
  else if (password !== passwordConfirm) {
    //change this from an alert later
    alert("Passwords do not match!")
  }
  $("#name").val("")
  $("#password").val("")
  $("#password-confirm").val("")
  $("#email").val("")
});