const aws = require('aws-sdk');

const dynamodb = new aws.DynamoDB; // get the dynamoDB SDK

const dynamoTable = process.env.TABLE_NAME;

const api_function = {};

api_function.handler = async(event) => {
    console.log(event);

    let response = {};

    try {
        if (event.path.includes('/users') && event.httpMethod=='GET'){
            if (event.pathParameters) {
                let user_ID = event.pathParameters.id;
                response.body = JSON.stringify(await api_function.readUsersById(user_ID));
            }
            else {
                response.body = JSON.stringify(await api_function.readUsers());
            }
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

api_function.readUsers = () => {
    return new Promise((resolve,reject) => {
        let params = {
            TableName: dynamoTable
        };

        dynamodb.scan(params, (err,data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

api_function.readUsersById = (user_ID) => {
    return new Promise((resolve,reject) => {
        let params = {
            TableName: dynamoTable,
            Key: {
                "user_id": {
                    S: user_ID
                }
            }
        };

        dynamodb.getItem(params, (err,data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

/*
No API request body input required
*/

module.exports = api_function;