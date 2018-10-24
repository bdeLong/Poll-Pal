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
    var uid = user.uid
    console.log(firebase.auth().currentUser);

    database.ref("users/" + uid).once("value", function (snapshot) {
      $("#name").text(snapshot.val().name);
      var address = snapshot.val().address;
      var apiKey = "AIzaSyBUV4WGjBXDv3ZBSJ9gTtvOBWBJr3NS90M";
      var queryURL = "https://www.googleapis.com/civicinfo/v2/voterinfo?address=" + address + "&key=" + apiKey;
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function (response) {
        console.log(response);
        $("#election-date").text(response.election.electionDay);
        var elections = response.contests
        var pollingPlaces = response.pollingLocations;
        if (pollingPlaces === undefined) {
          $("#polling-places").html("<p>Polling Location Info Unavailable, Please check other sources </p>")
        }
        else {
          for (var p = 0; p < pollingPlaces.length; p++) {
            var pollingAddressRef = pollingPlaces[p].address;
            var pollingLocation = $("<p>");
            pollingLocation.attr("id", "poll-address")
            var pollInfoBttn = $("<button>").text("More Info");
            if (pollingAddressRef.line2 !== undefined) {
              pollingLocation.html(pollingAddressRef.locationName + "<br>" + pollingAddressRef.line1 + "<br>" + pollingAddressRef.line2 + "<br>" + pollingAddressRef.city + ", " + pollingAddressRef.state + " " + pollingAddressRef.zip);
            }
            else { pollingLocation.html(pollingAddressRef.locationName + "<br>" + pollingAddressRef.line1 + "<br>" + pollingAddressRef.city + ", " + pollingAddressRef.state + " " + pollingAddressRef.zip); }

            pollInfoBttn.attr({
              class: "poll-more-info-btn",
              "data-poll-place-index": p
            });

            $("#polling-places").append(pollingLocation, pollInfoBttn);
          };
        };



        $(".poll-more-info-btn").on("click", function () {
          var pollPlaceIndex = $(this).attr("data-poll-place-index");
          var pollPlaceHours = $("<p>")
          pollPlaceHours.text("Hours : " + pollingPlaces[pollPlaceIndex].pollingHours);
          $("#poll-deets").append(pollPlaceHours);
          if (pollingPlaces[pollPlaceIndex].notes !== "") {
            var pollPlaceNotes = $("<p>");
            pollPlaceNotes.text("Special Notes : " + pollingPlaces[pollPlaceIndex].notes);
            $("#poll-deets").append(pollPlaceNotes);
          }

          var directionsService = new google.maps.DirectionsService();
          var directionsDisplay = new google.maps.DirectionsRenderer();

          var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          directionsDisplay.setMap(map);

          var request = {
            origin: address,
            destination: $("#poll-address").text(),
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          };

          directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
            }
          });


          //add map and shit
        });

        for (var i = 0; i < elections.length; i++) {
          var ballotInfo = $("#ballot-info");
          var candidates = elections[i].candidates;
          var ballotDiv = $("<div>");
          ballotDiv.attr("id", "race" + i);
          var electionName = $("<p>");
          var electionDistrict = $("<p>");
          electionName.text(elections[i].office);
          electionDistrict.text(elections[i].district.name)
          ballotDiv.append(electionName, electionDistrict);
          if (candidates !== undefined) {
            for (var c = 0; c < candidates.length; c++) {
              var candidateDiv = $("<div>");
              candidateDiv.attr("class", "d-inline-block");
              var candidateName = $("<p>");
              var candidateParty = $("<p>");
              var chooseCandidate = $("<button>").text("Add to Ballot");
              chooseCandidate.attr({
                class: "add-to-ballot d-block",
                'data-elec-index': i,
                'data-cand-index': c
              });
              var candidateInfoBttn = $("<button>");
              candidateInfoBttn.attr({
                class: "cand-info",
                'data-elec-index': i,
                'data-cand-index': c
              });
              candidateInfoBttn.text("View More");
              candidateName.text(candidates[c].name);
              if (candidates[c].party !== undefined) {
                candidateParty.text(candidates[c].party);
              }
              else if (candidates[c].party === undefined) {
                candidateParty.text("No Affiliated Party");
              };
              candidateDiv.append(candidateName, candidateParty, chooseCandidate, candidateInfoBttn);
              ballotDiv.append(candidateDiv);
              ballotInfo.append(ballotDiv);
            };
          };
        };

        $("#ballot-info").slick({
          prevArrow: "<button type=\"button\" class=\"slick-prev\">Previous</button>",
          adaptiveHeight: true
        });

        $(".add-to-ballot").on("click", function () {
          var electionIndex = $(this).attr("data-elec-index");
          var candidateIndex = $(this).attr("data-cand-index");
          database.ref("users/" + uid + "/ballot/ballot-position-" + electionIndex).set({
            office: elections[electionIndex].office,
            district: elections[electionIndex].district.name,
            candidate: elections[electionIndex].candidates[candidateIndex].name,
            candidateParty: elections[electionIndex].candidates[candidateIndex].party
          });
        });

        $(".cand-info").on("click", function () {
          var candidateInfo = $("#candidate-info");
          candidateInfo.html("");
          var electionIndex = $(this).attr("data-elec-index");
          var candidateIndex = $(this).attr("data-cand-index");
          var candidateRef = elections[electionIndex].candidates[candidateIndex]
          var candidateUrl = $("<p>")
          var candidateEmail = $("<p>");
          var candidatePhone = $("<p>");
          candidateUrl.html(candidateRef.name + " : <a href=\"" + candidateRef.candidateUrl + "\" target=\"blank\">Website</a>");
          candidateEmail.text("Email: " + candidateRef.email);
          candidatePhone.text("Phone: " + candidateRef.phone);

          if (candidateRef.candidateUrl !== undefined && candidateRef.email !== undefined && candidateRef.phone !== undefined) {
            candidateInfo.append(candidateUrl, candidateEmail, candidatePhone);
          }

          else if (candidateRef.candidateUrl !== undefined && candidateRef.email !== undefined) {
            candidateInfo.append(candidateUrl, candidateEmail);
          }

          else if (candidateRef.candidateUrl !== undefined && candidateRef.phone !== undefined) {
            candidateInfo.append(candidateUrl, candidatePhone);
          }

          else if (candidateRef.candidateUrl !== undefined) {
            candidateInfo.append(candidateUrl);
          }

          else if (candidateRef.email !== undefined && candidateRef.phone !== undefined) {
            candidateInfo.append(candidateEmail, candidatePhone);
          }

          else if (candidateRef.email !== undefined) {
            candidateInfo.append(candidateEmail);
          }

          else if (candidateRef.phone !== undefined) {
            candidateInfo.append(candidatePhone);
          }

          else if (candidateRef.candidateUrl === undefined && candidateRef.email === undefined && candidateRef.phone === undefined && candidateRef.channels === undefined) {
            candidateInfo.html("<p>No Contact Info Provided</p>").append();
          }

          if (candidateRef.channels !== undefined) {
            for (d = 0; d < candidateRef.channels.length; d++) {
              var candidateSocial = $("<p>")
              var channelRef = candidateRef.channels[d];
              var channelType = channelRef.type;
              var channelId = channelRef.id;
              candidateSocial.html(channelType + " : " + "<a href=\"" + channelId + "\" target=\"blank\">" + channelId + "</a>");
              candidateInfo.append(candidateSocial);
            }
          }
          $(".slick-arrow").on("click", function () {
            $("#candidate-info").html("");
          });
        });
      });
    });
  }
  else {
    window.location.replace("index.html");
  }
});

$("#log-out").on("click", function () {
  firebase.auth().signOut().then(function () {
    window.location.replace("index.html");
  });
});
