import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class FineGrainedAssertionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数リソース (関数本体はインライン形式で記述)
    const lambdaFunction = new cdk.aws_lambda.Function(this, "MyLamdba1", {
      handler: "index.handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      code: cdk.aws_lambda.Code.fromInline(`
              exports.handler = async(args) => {
                let response = {
                  statusCode: 200,
                  body: JSON.stringify("Hello From Lambda")
                };
                return response;
              }
            `),
    });

    const env = this.node.tryGetContext("env");
    const systenName = this.node.tryGetContext("sys");
    cdk.Tags.of(lambdaFunction).add("MyLambdaTag", `${env}-${systenName}`);
    
    new cdk.aws_lambda.Function(this, "MyLamdba2", {
      handler: "index.handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      code: cdk.aws_lambda.Code.fromInline(`
              exports.handler = async(args) => {
                let response = {
                  statusCode: 200,
                  body: JSON.stringify("Hello From Lambda")
                };
                return response;
              }
            `),
    });
  }
}


