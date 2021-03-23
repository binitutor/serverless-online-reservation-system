// do this ... once html doc is loaded!!!
$(document).ready(function() {
    var currentMonth = $('#currentMonth');
    var str = '';
    var reqHour, reqDate, thisMonth, thisDate, thisYear, thisDateName;

    var currentYear = dateProps(3);
    var currentMonthName = dateProps(2)[dateProps(1)];
    str = currentMonthName + ' ' + currentYear; // Mar 2021

    // update table title
    currentMonth.html(str);

    // CRUD function --- POST(CREATE)
    // capture cell data on click
    $('#calendar').find('td').click(function() {
        // capture cell text
        reqHour = $(this).text(); // 8:00am-9:00am;
        thisMonth = $(this).attr('month');
        thisDate = $(this).attr('date');
        thisYear = $(this).attr('year');
        thisDateName = $(this).attr('date-name');

        reqDate = thisDateName + ', ' + thisMonth + ' ' + thisDate + ', ' + thisYear;

        // display selections 
        $('#selectedDate').html(reqDate); // Thursday, March 19, 2021
        $('#selectedHour').html(reqHour); // 8:00am-9:00am;

        // CRUD function --- POST(CREATE)
        // capture form data on submit
        $('#submit').click(function(e) {
            e.preventDefault();
            var cusName = $('#cusName').val();
            var cusPhone = $('#cusPhone').val();
            var cusEmail = $('#cusEmail').val();

            // validate
            // if date and hour are empty, error
            if (reqHour == '' || reqDate == '') {
                alert('Please select a specific hour from the calendar!');
            } else if (cusName == '' || cusPhone == '' || cusEmail == '') {
                alert('Please fill in all fields!');
            } else {
                alert('Request submitted successfully!');


                // CRUD function --- POST(CREATE)
                // make API POST request, save data to the database table
                var myURL = 'https://fa1k4pmjhc.execute-api.us-east-1.amazonaws.com/production/bookingrequest';
                var data = {
                        cusEmail: cusEmail,
                        cusName: cusName,
                        cusPhone: cusPhone,
                        reqDate: reqDate,
                        reqHour: reqHour
                    }
                    // async await
                $.ajax({
                    type: "POST",
                    url: myURL,
                    data: JSON.stringify(data),
                    success: function() {
                        alert('Request submitted successfully!');
                    },
                    error: function() {
                        // alert('SORRY!! Your request was unseccessful.')
                    }
                });
            }
        });

    });

    // CRUD function --- GET(READ)
    // fetch all data on btn click
    $('#fetchData').click(function(e) {
        e.preventDefault();

        // make a GET request to the database
        var myURL = 'https://fa1k4pmjhc.execute-api.us-east-1.amazonaws.com/production/bookingrequests';
        var tr = '';
        var dataBody = $('#dataBody');

        $.ajax({
            type: 'GET',
            url: myURL,
            success: function(db_data) {

                db_data.bookingRequests.forEach(function(bookingRequest) {
                    tr += '<tr><td><div>' + bookingRequest.cusName + '<br>' + bookingRequest.cusPhone + '<br>' + bookingRequest.cusEmail + '</div></td>';
                    tr += '<td><div>' + bookingRequest.reqDate + '<br>' + bookingRequest.reqHour + '</div></td></tr>';
                });

                dataBody.html(tr); // replace existing data        

                alert('Data fetched Successfully!');
            },
            error: function(db_data) {
                alert('Error!');
            }
        });
    });

    // CRUD function --- GET(READ)
    // fetches all data and then filter through it...
    $('#fetchFilteredData').click(function(e) {
        e.preventDefault();

        // close the modal
        $('#fetchFilteredData').attr('data-dismiss', 'modal');

        var emailInput = '';
        emailInput = $('#emailInput1').val();

        if (emailInput === '') {
            alert("I can't fetch an empty request, LOL");
        } else {
            // make a GET request for single item to the database
            var myURL = 'https://fa1k4pmjhc.execute-api.us-east-1.amazonaws.com/production/bookingrequests';
            var tr = '';
            var dataBody = $('#dataBody');

            $.ajax({
                type: 'GET',
                url: myURL,
                success: function(db_data) {
                    // filtering ...
                    db_data.bookingRequests.forEach(function(bookingRequest) {
                        if (bookingRequest.cusEmail == emailInput) {
                            tr += '<tr><td><div>' + bookingRequest.cusName + '<br>' + bookingRequest.cusPhone + '<br>' + bookingRequest.cusEmail + '</div></td>';
                            tr += '<td><div>' + bookingRequest.reqDate + '<br>' + bookingRequest.reqHour + '</div></td></tr>';
                        }

                    });

                    dataBody.html(tr); // replace existing data        

                    alert('Data fetched Successfully!');

                },
                error: function(db_data) {
                    alert('Data not found!');
                }
            });


        }
    });


    // CRUD function --- GET(READ)
    // fetch single data ...


    $('#fetchSingleData').click(function(e) {
        e.preventDefault();

        // close the modal
        $('#fetchSingleData').attr('data-dismiss', 'modal');

        var emailInput = '';
        emailInput = $('#emailInput2').val();

        if (emailInput === '') {
            alert("I can't fetch an empty request, LOL");
        } else {
            // make a GET request for single item to the database
            var myURL = 'https://fa1k4pmjhc.execute-api.us-east-1.amazonaws.com/production/bookingrequest';
            var tr = '';
            var dataBody = $('#dataBody');

            $.ajax({
                type: 'GET',
                url: myURL,
                data: { cusEmail: emailInput }, // data we pass to server
                success: function(db_data) {
                    // single data
                    tr += '<tr><td><div>' + db_data.cusName + '<br>' + db_data.cusPhone + '<br>' + db_data.cusEmail + '</div></td>';
                    tr += '<td><div>' + db_data.reqDate + '<br>' + db_data.reqHour + '</div></td></tr>';

                    dataBody.html(tr); // replace existing data        

                    alert('Single Data fetched Successfully!');

                },
                error: function(db_data) {
                    alert('Data not found!');
                }
            });


        }
    });


    // CRUD function --- PATCH(UPDATE)
    $('#editSingleData').click(function(e) {
        e.preventDefault();

        // close the modal
        $('#editSingleData').attr('data-dismiss', 'modal');

        var emailInput = '',
            dataTypeInput = '',
            newValueInput = '';
        emailInput = $('#emailInput3').val();
        dataTypeInput = $('#dataTypeInput').val(); // drop down list: name, phone, requested date, requested hour
        newValueInput = $('#newValueInput').val(); // new value

        if (emailInput === '') {
            alert("I can't edit an empty request, LOL");
        } else {
            // make a GET request for single item to the database
            var myURL = 'https://fa1k4pmjhc.execute-api.us-east-1.amazonaws.com/production/bookingrequest';

            var dataBody = {
                cusEmail: emailInput, // row key, which row ?
                updateKey: dataTypeInput, // tbl column name [cusName, cusPhone, reqDate, reqHour]
                updateValue: newValueInput // new value
            }

            // PUT updates all fields, 
            // PATCH = Partial Update, updates a single field!!!
            $.ajax({
                type: 'PATCH', // PUT???
                url: myURL,
                data: JSON.stringify(dataBody), // convert to JSON and pass to server
                success: function(db_data) {

                    alert('Data edited Successfully!');
                    location.reload();
                },
                error: function(db_data) {
                    alert('Data not found!');
                }
            });


        }
    });


    // CRUD function --- DELETE
    $('#deleteSingleData').click(function(e) {
        e.preventDefault();

        // close the modal
        $('#deleteSingleData').attr('data-dismiss', 'modal');

        var emailInput = '';
        emailInput = $('#emailInput4').val();

        if (emailInput === '') {
            alert("I can't delete an empty request, LOL");
        } else {
            // make a DELETE request for single item to the database
            var myURL = 'https://fa1k4pmjhc.execute-api.us-east-1.amazonaws.com/production/bookingrequest';

            var dataBody = {
                cusEmail: emailInput
            }

            $.ajax({
                type: 'DELETE',
                url: myURL,
                data: JSON.stringify(dataBody), // data we pass to server
                success: function(db_data) {

                    alert('Data deleted Successfully!');
                    location.reload();
                },
                error: function(db_data) {
                    alert('Data not found!');
                }
            });


        }

    });

    // CRUD function --- POST(CREATE)
    // booking slots creation
    $('#newSlots').click(function(e) {
        e.preventDefault();

        // capture data
        var thisDate = $('#crDate').val(); // Thursday, March 19, 2021
        var thisHour = $('#crHour').val(); // 10:00am-11:00am

        var str = thisDate.split('-'); // array[2021,03,16], (yyyy-MM-dd)

        // get month name
        var newMonth = parseInt(str[1] - 1); // 0 - 11
        var monthsArray = dateProps(2); // month names array
        var selectedMonthName = monthsArray[newMonth]; // March


        // get date name
        var newDateObj = new Date(str[0], newMonth, str[2]); // yyyy-MM-dd
        var selectedDay = newDateObj.getDay(); // 0 - 6, su = 0 ... sa = 6
        var weekDaysArray = dateProps(5);
        var selectedDateName = weekDaysArray[selectedDay]; // Thursday

        // get date number (1 - 31)
        var selectedDateNum = str[2]; // 1 - 31

        // get year
        var selectedYear = str[0]; // 2021

        var crDate = '',
            crHour = '';
        crDate = selectedDateName + ', ' + selectedMonthName + ' ' + selectedDateNum + ', ' + selectedYear; // Thursday, March 19, 2021
        crHour = thisHour; // 10:00am-11:00am

        // alert('User Selection: ' + crDate + ' at: ' + crHour);

        // save to database
        if (crDate == '' || crHour == '') {
            alert("Please fill in the form");
        } else {
            // make a GET request for single item to the database
            var myURL = 'https://fa1k4pmjhc.execute-api.us-east-1.amazonaws.com/production/bookingslot';

            var data = {
                crDate: crDate,
                crHour: crHour
            }

            $.ajax({
                type: 'POST',
                url: myURL,
                data: JSON.stringify(data),
                success: function(db_data) {

                    alert('Booking Slot saved Successfully!');

                },
                error: function(db_data) {
                    alert('Data not Saved!');
                }
            });

        }


    });


    // CRUD function --- GET(READ)
    // booking slots read
    // add created dates and hours on load.
    $(function() {

        // make a GET request of ALL data from the database
        var myURL = 'https://fa1k4pmjhc.execute-api.us-east-1.amazonaws.com/production/bookingslots';
        var tr = '';
        var dataBody = $('#timeSlotBody');
        var month, date, year, dateName, str, str2;

        $.ajax({
            type: 'GET',
            url: myURL,
            success: function(db_data) {

                db_data.bookingSlots.forEach(function(bookingSlot) { // date & Hour

                    str = bookingSlot.crDate.split(', '); // Thursday, March 19, 2021 ==> [Thursday] [March 19] [2021]
                    str2 = str[1].split(' '); // March 19 ==> [March] [19]

                    month = str2[0]; // March
                    date = str2[1]; // 19
                    year = str[2]; // 2021
                    dateName = str[0]; // Thursday

                    tr += '<tr><td month="' + month + '" date="' + date + '" year="' + year + '" date-name="' + dateName + '">';
                    tr += '<div>' + bookingSlot.crDate + '<br>' + bookingSlot.crHour + '</div>';
                    tr += '</td>';
                    // tr += '<td class="editCell"><i class="fas fa-edit"></i></td>';
                    tr += '<td class="editCell"> <i class="fas fa-edit btn btn-info btn-block editCell">Edit</i></td>';
                    tr += '<td class="deleteCell"> <i class="far fa-trash-alt btn btn-danger btn-block deleteCell">Delete</i></td>';
                    tr += '</tr>';

                });

                dataBody.html(tr); // replace existing data  
            },
            error: function(db_data) {
                alert('Error!');
            }
        });
    })



    // CRUD function --- PATCH(UPDATE)
    // booking slots edit
    // on cell click, if its class is fa-edit ==> edit the row data
    $('#editCell').click(function(e) {
        alert('edit cell clicked!');
    });


    // CRUD function --- DELETE
    // booking slots delete
    // on cell click, if its class is fa-trash-alt ==> delete the row data
    $('.deleteCell').on('click', function(e) {
        alert('Delete cell clicked!');
    });


});


/*
    dateArray[0] = date; // full format
    dateArray[1] = month; // 0 - 11
    dateArray[2] = monthsNames; // months array
    dateArray[3] = year; // 2021
    dateArray[4] = currentDay; // 0 - 6
    dateArray[5] = weekDays; // week days array
    dateArray[6] = currentDate; // 1 - 31
*/
function dateProps(num) {
    var dateArray = new Array();
    var date = new Date(); // full format

    // Month
    var month = date.getMonth(); // 0 - 11
    var monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    //year
    var year = date.getFullYear(); // 2021

    // days
    var currentDay = date.getDay(); // 0 - 6, 0 = sunday
    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var currentDate = date.getDate(); // 1 - 31

    dateArray[0] = date;
    dateArray[1] = month;
    dateArray[2] = monthsNames;
    dateArray[3] = year;
    dateArray[4] = currentDay;
    dateArray[5] = weekDays;
    dateArray[6] = currentDate;

    return dateArray[num];
}