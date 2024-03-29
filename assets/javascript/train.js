var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";
var elTrain = $("#train-name");
var elTrainDestination = $("#train-destination");
// form validation for Time using jQuery Mask plugin
var elTrainTime = $("#train-time").mask("00:00");
var elTimeFreq = $("#time-freq").mask("00");
// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAAVhJbeeTFX8sspjNZRaQWrvKg_3gM9nY",
    authDomain: "ky82-51394.firebaseapp.com",
    databaseURL: "https://ky82-51394.firebaseio.com",
    projectId: "ky82-51394",
    storageBucket: "ky82-51394.appspot.com",
    messagingSenderId: "468990647105",
    appId: "1:468990647105:web:3066ea4df2215d15"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

database.ref("/train-scheduler").on("child_added", function(snapshot) {
    //  create local variables to store the data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
    trainRemainder = trainDiff % frequency;

    // subtract the remainder from the frequency, store in var
    minutesTillArrival = frequency - trainRemainder;
    // add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");
    // append to our table of trains, inside tbody, with a new row of the train data
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

    $("#table-data").on("click", "tr span", function() {
        console.log(this);
        var trainRef = database.ref("/train-scheduler/");
        console.log(trainRef);
    });
});
// function to call the button event, and store the values in the input form
var storeInputs = function(event) {
    event.preventDefault();
    trainName = elTrain.val().trim();
    trainDestination = elTrainDestination.val().trim();
    trainTime = moment(elTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = elTimeFreq.val().trim();

    // add to firebase databse
    database.ref("/train-scheduler").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  alert that train was added
    alert("Train successuflly added!");
    //  empty form once submitted
    elTrain.val("");
    elTrainDestination.val("");
    elTrainTime.val("");
    elTimeFreq.val("");
};
// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        storeInputs(event);
    }
});
// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            storeInputs(event);
        }
    }
});