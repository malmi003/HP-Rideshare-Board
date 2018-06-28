/*
add validation to submitted Rideshares

*/
var config = {
    apiKey: "AIzaSyDpx_ce6nfAL5lmBW6m4j6SSCKPktPxmXM",
    authDomain: "myfirstfirebase-8b3c3.firebaseapp.com",
    databaseURL: "https://myfirstfirebase-8b3c3.firebaseio.com",
    projectId: "myfirstfirebase-8b3c3",
    storageBucket: "myfirstfirebase-8b3c3.appspot.com",
    messagingSenderId: "83041360224"
};
firebase.initializeApp(config);

let database = firebase.database();

let transpo = "",
    destination = "",
    nextArrival = "",
    minsAway = 0,
    initialTranspo = "Hogwarts Express * <span class='badge badge-secondary'>The only school sanctioned <br> route for ordinary students</span>",
    initialDestination = "Hogsmeade Station",
    initialFrequency = "Several many",
    frequency = initialFrequency,
    initialMinsAway = moment("9/1/2018 11:00", "M/D/YYYY HH:mm").diff(moment(), "minutes")
initialNextArrival = "1st of September 11:00 AM";

function minutesAway(firstMoment) {
    let timeDiff = moment().diff(firstMoment, "minutes");
    let tRemainder = timeDiff % frequency;
    let minsAwayVal = frequency - tRemainder;
    return minsAwayVal;
}
function nextArrivalFunction(minsAwayVal) {
    let nextArrivalVal = moment().add(minsAwayVal, "minutes").format("hh:mm A");
    return nextArrivalVal;
    // ---------------
}

$(document).ready(function () {

    database.ref().on("value", function (snapshot) {

        if (snapshot.child("HP Transpo").exists()) {

            $("#table-body").empty();

            snapshot.child("HP Transpo").forEach(function (item) {
                transpo = item.val().transpoName;
                destination = item.val().destinationName;
                frequency = item.val().frequencyVal;
                nextArrival = item.val().nextArrivalVal;
                minsAway = item.val().minsAwayVal;

                $("#table-body").append(`<tr>
                <td>${transpo}</td>
                <td>${destination}</td>
                <td>${frequency}</td>
                <td>${nextArrival}</td>
                <td>${minsAway}</td>
                </tr>`);
            })

        } else {

            transpo = initialTranspo;
            destination = initialDestination;
            frequency = initialFrequency;
            nextArrival = initialNextArrival;
            minsAway = initialMinsAway;

            database.ref("HP Transpo").push({
                transpoName: transpo,
                destinationName: destination,
                frequencyVal: frequency,
                nextArrivalVal: nextArrival,
                minsAwayVal: minsAway
            })
        };


    }, function (errorObject) {
        console.log("Whoopsies, there was an error: " + errorObject.code);
    });

    $("#add-new-transpo-btn").on("click", function (event) {

        event.preventDefault();


        transpo = $("#form-of-transpo").val().trim();
        destination = $("#destination").val().trim();
        frequency = parseInt($("#frequency").val());
        minsAway = minutesAway(moment($("#first-arrival").val().trim(), "HH:mm"));
        nextArrival = nextArrivalFunction(minsAway);


        database.ref("HP Transpo").push({
            transpoName: transpo,
            destinationName: destination,
            frequencyVal: frequency,
            minsAwayVal: minsAway,
            nextArrivalVal: nextArrival
        })

        $("#form-of-transpo").val("");
        $("#first-arrival").val("");
        $("#frequency").val("");

    });

    $("#empty-schedule-btn").on("click", function (event) {
        event.preventDefault();
        $("#table-body").empty();
        database.ref().child("HP Transpo").remove();
    })

});