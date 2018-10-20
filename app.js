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
  var firstName = $("#first-name").val().trim();
  var lastName = $("#last-name").val().trim();
  var password = $("#password").val().trim();
  var passwordConfirm = $("#password-confirm").val().trim();
  var address = $("#address").val().trim();
  var email = $("#email").val().trim();
  var secQuestion = $("#security-question").val();
  var secAnswer = $("#security-answer").val().trim();

  if (firstName !== "" && lastName !== "" && password !== "" && address !== "" && password === passwordConfirm && email !== "" && secQuestion !== null && secAnswer !== "") {
    database.ref().push({
      firstName,
      lastName,
      password,
      address,
      email,
      secQuestion,
      secAnswer
    });
  }
  else if (password !== passwordConfirm) {
    //change this from an alert later
    alert("Passwords do not match!")
  }
  else if (secQuestion === null) {
    alert("Please pick a security question");
  }
  else if (secAnswer === "") {
    alert("Please provide a security answer");
  }
})

database.ref().on("child_added", function (snapshot) {

  var address = snapshot.val().address;
  var apiKey = "AIzaSyBUV4WGjBXDv3ZBSJ9gTtvOBWBJr3NS90M";
  var queryURL = "https://www.googleapis.com/civicinfo/v2/voterinfo?address=" + address + "&key=" + apiKey;
  // var candidateInfo = $("#candidateinfo");
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var elections = response.contests
    console.log(elections);

    for (var i = 0; i < elections.length; i++) {
      var candidates = elections[i].candidates;
      for (var c = 0; c < candidates.length; c++) {
        console.log(candidates[c].name);
      }
    }
  });
});