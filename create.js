const aws = require('aws-sdk');

const dynamodb = new aws.DynamoDB; // get the dynamoDB SDK

const dynamoTable = process.env.TABLE_NAME;

const api_function = {};

api_function.handler = async(event) => {
    console.log(event);

    let response = {};

    try {
        if (event.path=='/users' && event.httpMethod=='POST'){
            response.body = JSON.stringify(await api_function.createUser(JSON.parse(event.body)));
        }
        response.statusCode = 200;
    } catch(e) {
        response.body = JSON.stringify(e);
        response.statusCode = 500;
    }

    response.headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    console.log(response);
    return response;

};

api_function.createUser = (item) => {
    return new Promise((resolve,reject) => {
        let params = {
            TableName: dynamoTable,
            Item: item
        };

        dynamodb.putItem(params, (err,data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

/*
event format:
- event.httpMethod = 'POST'
- event.path = '/users_create'
- event.body = '{\n    "user_id": "BWMP-883",\n    "name": "De Niro"\n}'
*/

/*
API Request Body format:
{"user_id": {"S": "baba43"}, "name": {"S": "thomas"}}
*/

module.exports = api_function;