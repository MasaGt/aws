/**
 * コンストラクトクラスをテスト
 * fine-grained-assertions.test.tsはスタックがテスト対象のため App をテストコード中で生成したが、
 * コンストラクトがテスト対象の場合、Appクラスを作成してなくても良いことを示すためにこのテストコードは存在する
 */
import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { LambdaConstruct } from "../lib/lambda-construct";

test("", () => {
    // AppではなくStackから作成する
    const stack = new cdk.Stack();
    new LambdaConstruct(stack, "MyLambdaConstruct");
    
    const template = Template.fromStack(stack);
    template.hasResourceProperties(
        "AWS::Lambda::Function",
        {
            Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name
        }
    );
});

