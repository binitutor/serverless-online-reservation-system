// This is for <<emailList>> function
var aws = require('aws-sdk');
var ses = new aws.SES({
    region: 'us-east-1'
});
exports.handler = function(event, context, callback) {

    let tabledetails = JSON.parse(JSON.stringify(event.Records[0].dynamodb));

    let cusEmail = tabledetails.NewImage.cusEmail.S;
    let cusName = tabledetails.NewImage.cusName.S;
    let cusPhone = tabledetails.NewImage.cusPhone.S;
    let reqHour = tabledetails.NewImage.reqHour.S;
    let reqDate = tabledetails.NewImage.reqDate.S;

    var eParams = {
        Destination: {
            ToAddresses: ["balemaye@masonlive.gmu.edu"]
        },
        Message: {
            Body: {
                Text: {
                    Data: "New data added:\n Email: " + cusEmail + "\n Full Name: " + cusName + "\n Phone Number: " + cusPhone + "\n Requested Date: " + reqDate + "\n Requested Hour: " + reqHour
                }
            },
            Subject: {
                Data: "Data Inserted in Dynamodb table: requestTbl"
            }
        },
        Source: "binitutor1@gmail.com"
    };
    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data) {
        if (err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            context.succeed(event);
            callback(null, "email is sent!");
        }
    });
}