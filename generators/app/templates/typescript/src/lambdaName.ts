exports.handler = async (): Promise<any> => {
  return {
    "headers": { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
    "statusCode": 200,
    "body": JSON.stringify({message: 'hello world'})
  };
};