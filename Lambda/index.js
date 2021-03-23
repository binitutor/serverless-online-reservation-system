// This is for <<request-api>> function
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

// tables
const tblOne = 'requestTbl';
const tblTwo = 'slotTbl';

// resources path
const siteHealthPath = '/sitehealth';
const bookingRequestPath = '/bookingrequest';
const bookingRequestsPath = '/bookingrequests';
const bookingSlotPath = '/bookingslot';
const bookingSlotsPath = '/bookingslots';

exports.handler = async function(event) {
    let response;
    console.log('Request event: ', event);

    switch (true) {
        case event.httpMethod == 'GET' && event.path == siteHealthPath:
            response = displayResponse(200);
            break;
        case event.httpMethod == 'GET' && event.path == bookingRequestPath:
            response = await getBookingRequest(event.queryStringParameters.cusEmail);
            break;
        case event.httpMethod == 'GET' && event.path == bookingSlotPath:
            response = await getBookingSlot(event.queryStringParameters.crDate);
            break;
        case event.httpMethod == 'GET' && event.path == bookingRequestsPath:
            response = await getBookingRequests();
            break;
        case event.httpMethod == 'GET' && event.path == bookingSlotsPath:
            response = await getBookingSlots();
            break;
        case event.httpMethod == 'POST' && event.path == bookingRequestPath:
            response = await postBookingRequest(JSON.parse(event.body));
            break;
        case event.httpMethod == 'POST' && event.path == bookingSlotPath:
            response = await postBookingSlot(JSON.parse(event.body));
            break;
        case event.httpMethod == 'PATCH' && event.path == bookingRequestPath:
            const editBody = JSON.parse(event.body);
            response = await updateBookingRequest(editBody.cusEmail, editBody.updateKey, editBody.updateValue);
            break;
        case event.httpMethod == 'PATCH' && event.path == bookingSlotPath:
            const editSecondBody = JSON.parse(event.body);
            response = await updateBookingSlot(editSecondBody.crDate, editSecondBody.updateKey, editSecondBody.updateValue);
            break;
        case event.httpMethod == 'DELETE' && event.path == bookingRequestPath:
            response = await deleteBookingRequest(JSON.parse(event.body).cusEmail)
            break;
        case event.httpMethod == 'DELETE' && event.path == bookingSlotPath:
            response = await deleteBookingSlot(JSON.parse(event.body).crDate)
            break;
        default:
            response = displayResponse(404, '404 Not Found!!!');
    }

    return response;
}

// displayResponse
function displayResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        // headers: { 'Content-Type':'application/json'},
        headers: {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT,HEAD,PATCH"
        },
        body: JSON.stringify(body)
    }
}

// GET/Read resources
async function getBookingRequest(cusEmail) {
    const params = {
        TableName: tblOne,
        Key: { 'cusEmail': cusEmail }
    }
    return await dynamodb.get(params).promise().then((response) => {
        return displayResponse(200, response.Item);
    }, (error) => {
        console.error('Error occured: ', error);
    });
}

async function getBookingSlot(crDate) {
    const params = {
        TableName: tblTwo,
        Key: { 'crDate': crDate }
    }
    return await dynamodb.get(params).promise().then((response) => {
        return displayResponse(200, response.Item);
    }, (error) => {
        console.error('Error occured: ', error);
    });
}

async function getBookingRequests() {
    const params = {
        TableName: tblOne
    }

    const allRequests = await scanDynamoRecords(params, []);

    const output = {
        bookingRequests: allRequests
    }

    return displayResponse(200, output);
}

async function getBookingSlots() {
    const params = {
        TableName: tblTwo
    }

    const allSlots = await scanDynamoRecords(params, []);

    const output = {
        bookingSlots: allSlots
    }

    return displayResponse(200, output);
}

// POST/Save resources
async function postBookingRequest(requestBody) {
    const params = {
        TableName: tblOne,
        Item: requestBody
    }
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: requestBody
        }
        return displayResponse(200, body);
    }, (error) => {
        console.error('Error occured: ', error);
    })
}

async function postBookingSlot(slotBody) {
    const params = {
        TableName: tblTwo,
        Item: slotBody
    }
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: slotBody
        }
        return displayResponse(200, body);
    }, (error) => {
        console.error('Error occured: ', error);
    })
}

// PATCH/Edit resources
async function updateBookingRequest(cusEmail, updateKey, updateValue) {
    const params = {
        TableName: tblOne,
        Key: { 'cusEmail': cusEmail },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: { ':value': updateValue },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            UpdatedAttributes: response
        }
        return displayResponse(200, body);
    }, (error) => {
        console.error('Error occured: ', error);
    })
}

async function updateBookingSlot(crDate, updateKey, updateValue) {
    const params = {
        TableName: tblTwo,
        Key: { 'crDate': crDate },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: { ':value': updateValue },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            UpdatedAttributes: response
        }
        return displayResponse(200, body);
    }, (error) => {
        console.error('Error occured: ', error);
    })
}

// DELETE resources
async function deleteBookingRequest(cusEmail) {
    const params = {
        TableName: tblOne,
        Key: { 'cusEmail': cusEmail },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        }
        return displayResponse(200, body);
    }, (error) => {
        console.error('Error occured: ', error);
    })
}

async function deleteBookingSlot(crDate) {
    const params = {
        TableName: tblTwo,
        Key: { 'crDate': crDate },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        }
        return displayResponse(200, body);
    }, (error) => {
        console.error('Error occured: ', error);
    })
}

// scanDynamoRecords
async function scanDynamoRecords(tblParameter, itemArr) {
    try {
        const dynamoData = await dynamodb.scan(tblParameter).promise();
        itemArr = itemArr.concat(dynamoData.Items);
        if (dynamoData.LastEvaluatedKey) {
            tblParameter.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(tblParameter, itemArr);
        }
        return itemArr;

    } catch (error) {
        console.error('Error occured: ', error);
    }
}