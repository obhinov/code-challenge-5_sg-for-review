const aws = require('aws-sdk');

const dynamodb = new aws.DynamoDB; // get the dynamoDB SDK

const dynamoTable = process.env.TABLE_NAME;

const api_function = {};

api_function.handler = async(event) => {
    console.log(event);

    let response = {};

    try {
        if (event.path=='/users' && event.httpMethod=='DELETE'){
            response.body = JSON.stringify(await api_function.deleteUser(JSON.parse(event.body)));
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

api_function.deleteUser = (item) => {
    return new Promise((resolve,reject) => {
        let params = {
            TableName: dynamoTable,
            Key: {
                "user_id": {
                    S: item.user_id.S
                }
            }
        };

        dynamodb.deleteItem(params, (err,data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

/*
API Request Body format:
{"user_id": {"S": "baba43"}}
*/

module.exports = api_function;