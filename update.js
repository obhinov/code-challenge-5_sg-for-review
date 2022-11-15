const aws = require('aws-sdk');

const dynamodb = new aws.DynamoDB; // get the dynamoDB SDK

const dynamoTable = process.env.TABLE_NAME;

const api_function = {};

api_function.handler = async(event) => {
    console.log(event);

    let response = {};

    try {
        if (event.path=='/users' && event.httpMethod=='PUT'){
            response.body = JSON.stringify(await api_function.updateUser(JSON.parse(event.body)));
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

api_function.updateUser = (item) => {
    return new Promise((resolve,reject) => {
        let params = {
            TableName: dynamoTable,
            ExpressionAttributeNames: {
                "#N": "name"
            },
            ExpressionAttributeValues: {
                ":n": {
                    S: item.name.S
                }
            },
            UpdateExpression: "SET #N = :n",
            Key: {
                "user_id": {
                    S: item.user_id.S
                }
            }
        };

        dynamodb.updateItem(params, (err,data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

/*
API Request Body format:
{"user_id": {"S": "wnwn834"}, "name": {"S": "newNameJeremy"}}
*/

module.exports = api_function;