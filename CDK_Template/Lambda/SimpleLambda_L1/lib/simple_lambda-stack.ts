/**
 * L1コンストラクトを利用してHelloメッセージを返すLambda関数を作成するだけのコード
 */

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { CfnRole } from 'aws-cdk-lib/aws-iam';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SimpleLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambdaに付与する信頼ポリシー (信頼ポリシーのみで、許可ポリシーは無し)
    const role = new CfnRole(this, "LambdaRole", {
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: [
                'lambda.amazonaws.com'
              ]
            },
            Action: [
              'sts:AssumeRole'
            ]
          }
        ]
      }
    });
    
    // Lambda関数リソース (関数本体はインライン形式で記述)
    new CfnFunction(this, "MyLambda", {
      runtime: "nodejs22.x",
      handler: "index.handler",
      role: role.attrArn,
      code: {
        zipFile: `
          exports.handler = async (args) => {
            let response = {
              statusCode: 200,
              body: JSON.stringify("Hello From Lambda")
            };
            return response;
          };
        `
      }
    });
  }
}




