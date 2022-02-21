import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    _event.queryStringParameters = _event.queryStringParameters || {};
    const action = _event.queryStringParameters.action;

    console.log('Azure lambda');

    return { statusCode: 200, body: JSON.stringify({ action }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};