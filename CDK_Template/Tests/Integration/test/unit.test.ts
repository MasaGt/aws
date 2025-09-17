//Integration Test実行時にもSnapshot Testは実行されるためここでSnapshot Testは行わない
import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import * as Integration from "../lib/integration-stack";

test("Num Count Test", () => {
  const app = new cdk.App();
  const stack = new Integration.IntegrationStack(app, "MyStack");

  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::Lambda::Function", 2);
  template.resourceCountIs("AWS::ApiGatewayV2::Api", 1);
  template.resourceCountIs("AWS::DynamoDB::GlobalTable", 1);
});

test("Lambda Permission Test", () => {
  //認証関数にDynamoDBへのアクセスが許可されているかチェック
  const app = new cdk.App();
  const stack = new Integration.IntegrationStack(app, "MyStack");

  const template = Template.fromStack(stack);
  //DynamoDBにアクセス許可しているIAMポリシーがあるかどうか
  template.hasResourceProperties("AWS::IAM::Policy", {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: Match.arrayWith(["dynamodb:GetItem"]),
          Effect: "Allow",
          Resource: Match.anyValue(), // 実際の ARN はマッチしなくてもOK
        }),
      ]),
    },
  });
});
