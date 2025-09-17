//テストコード
import * as cdk from "aws-cdk-lib";
import { IntegrationStack } from "../lib/integration-stack";
import * as it from "@aws-cdk/integ-tests-alpha";

//Step1. 空のAppを作成
const app = new cdk.App();

//Step2. テスト対象のスタックを生成
const targetStack = new IntegrationStack(app, "MyStack");

//Step3. IntegTestインスタンス (コンストラクトを生成)
const integTest = new it.IntegTest(app, "TestStack", {
    testCases: [targetStack] //testCasesにテスト対象のスタックを指定
});

//Step3.5 dynamoに認証用ユーザーの登録
const userID = "100";
const putItemCall = integTest.assertions.awsApiCall('DynamoDB', 'putItem', {
  TableName: targetStack.userTable,
  Item: {
    user_id: { S: userID },
    name: { S: 'UserA' }
  },
});

//Step4. Lambda関数(/greetingに統合したLambda関数を呼び出す)
integTest.assertions.httpApiCall(`${targetStack.endpointURL}?user_id=${userID}`, {
    method: "GET",
    headers: {
        "Auth": "Allow"
    },
}).expect(it.ExpectedResult.objectLike({
    status: 200,
    body: "Hello From Lambda"
})).waitForAssertions({
    totalTimeout: cdk.Duration.seconds(25),
    interval: cdk.Duration.seconds(5),
});

// //Step5. ヘッダーにAuthを含まない(=401エラー)ケース
// integTest.assertions.httpApiCall(`${targetStack.endpointURL}?user_id=${userID}`, {
//     method: "GET",
// }).expect(it.ExpectedResult.objectLike({
//     status: 401,
// }));
    
// //Step6. クエリパラメーターにuser_idを含まない(=401)ケース
// integTest.assertions.httpApiCall(`${targetStack.endpointURL}`, {
//     method: "GET",
// }).expect(it.ExpectedResult.objectLike({
//     status: 401,
// }));
    
// //Step7. リクエストボディに含めるユーザーIDが登録されていない(=403エラー)ケース
// integTest.assertions.httpApiCall(`${targetStack.endpointURL}?user_id=999`, {
//     method: "GET",
//     headers: {
//         "Auth": "Allow"
//     },
// }).expect(it.ExpectedResult.objectLike({
//     status: 403,
// })).waitForAssertions({
//     totalTimeout: cdk.Duration.seconds(25),
//     interval: cdk.Duration.seconds(5),
// });;