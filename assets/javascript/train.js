/*


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

let initialTranspo = "Hogwarts Express * <span class='badge badge-secondary'>The only school sanctioned <br> route for ordinary students</span>",
    initialDestination = "Hogsmeade Station",
    initialFrequency = "8,640",

    initialNextArrival = moment("9/1/2015 11:00", "M/D/YYY HH:mm"),
    initialMinsAway = "not totally sure how to do this math",

    transpo = "",
    destination = "",
    frequency = "",
    nextArrival = "",
    minsAway = "";


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
                nextArrivalVal: nextArrival
            })
        };


    }, function (errorObject) {
        console.log("Whoopsies, there was an error: " + errorObject.code);
    });

    $("#add-new-transpo-btn").on("click", function (event) {

        event.preventDefault();


        let transpoName = $("#form-of-transpo").val();
        let destinationName = $("#destination").val();
        let frequencyVal = parseInt($("#frequency").val());
        //some maths
        let firstArrival = moment($("#first-arrival").val(), "HH:mm").subtract(1, "years");
        let currentTime = moment();
        let timeDiff = currentTime.diff(firstArrival, "minutes");
        let tRemainder = timeDiff % frequencyVal;
        let minsAwayVal = frequencyVal - tRemainder;

        let nextArrivalVal = currentTime.add(minsAwayVal, "minutes").format("hh:mm A");


        database.ref("HP Transpo").push({
            transpoName: transpoName,
            destinationName: destinationName,
            frequencyVal: frequencyVal,
            minsAwayVal: minsAwayVal,
            nextArrivalVal: nextArrivalVal
        })

    });

    $("#empty-schedule-btn").on("click", function (event) {
        event.preventDefault();
        $("#table-body").empty();
        database.ref().child("HP Transpo").remove();
    })

});