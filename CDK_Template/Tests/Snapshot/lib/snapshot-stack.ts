import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SnapshotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数リソース (関数本体はインライン形式で記述)
    new cdk.aws_lambda.Function(this, "TweakedMyLamdba", {
      handler: "index.handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      // role: role,
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



