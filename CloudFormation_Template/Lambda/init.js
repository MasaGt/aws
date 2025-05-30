// Dockerfileに含めるLambda関数用のコード
exports.handler = async (args) => {
    let response = {
        statusCode: 200,
        body: JSON.stringify("Hello From Docker Image")
    };
    return response;
}