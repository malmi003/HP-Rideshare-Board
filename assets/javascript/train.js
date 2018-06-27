/*
- need to add initial entry to database
- need to clear out old entries

*/
// Initialize Firebase
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

//Initial Values
let initialTranspo = "Hogwarts Express",
    initialDestination = "Hogsmeade",
    initialFrequency = "8,640",
    initialNextArrival = "September 1st, 11:00 AM",
    initialMinsAway = "not totally sure how to do this math",
    transpo = "",
    destination = "",
    frequency = "",
    nextArrival = "",
    minsAway = "";


$(document).ready(function () {
    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    // This function allows you to update your page in real-time when the firebase database changes.
    database.ref().on("value", function (snapshot) {

        // If Firebase has a highPrice and highBidder stored (first case)
        if (snapshot.child("HP Transpo").exists()) {

            $("#table-body").empty();
            
            snapshot.child("HP Transpo").forEach(function (item) {
                transpo = item.val().transpoName;
                destination = item.val().destinationName;
                frequency = item.val().frequencyVal;
                nextArrival = item.val().nextArrivalVal;
                minsAway = item.val().minsAwayVal;
                // Change the HTML to reflect the stored values
                
                $("#table-body").append(`<tr>
                <td>${transpo}</td>
                <td>${destination}</td>
                <td>${frequency}</td>
                <td>${nextArrival}</td>
                <td>${minsAway}</td>
                </tr>`);
            })

        } else {
            // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
            transpo = initialTranspo;
            destination = initialDestination;
            frequency = initialFrequency;
            nextArrival = initialNextArrival;
            minsAway = initialMinsAway;

            // Change the HTML to reflect the initial values
            $("#table-body").append(`<tr>
            <td>${transpo}</td>
            <td>${destination}</td>
            <td>${frequency}</td>
            <td>${nextArrival}</td>
            <td>${minsAway}</td>
            </tr>`);

            database.ref("HP Transpo").push({
                transpoName: transpo,
                destinationName: destination,
                frequencyVal: frequency,
                nextArrivalVal: nextArrival
            })


        };
        // If any errors are experienced, log them to console.
    }, function (errorObject) {
        console.log("Whoopsies, there was an error: " + errorObject.code);
    });

    // Whenever a user clicks the submit-bid button
    $("#add-new-transpo-btn").on("click", function (event) {
        // Prevent form from submitting
        event.preventDefault();


        // Get the input values
        let transpoName = $("#form-of-transpo").val();
        let destinationName = $("#destination").val();
        let frequencyVal = $("#frequency").val();
        //need to calc next arrival and minutes away from this
        let nextArrivalVal = $("#first-train").val();


        // Save the new price in Firebase
        database.ref("HP Transpo").push({
            transpoName: transpoName,
            destinationName: destinationName,
            frequencyVal: frequencyVal,
            nextArrivalVal: nextArrivalVal
        })


    });

    $("#empty-schedule-btn").on("click", function(event) {
        event.preventDefault();
        $("#table-body").empty();
        database.ref().child("HP Transpo").remove();
    })

});