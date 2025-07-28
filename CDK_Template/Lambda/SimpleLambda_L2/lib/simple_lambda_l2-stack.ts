/**
 * L1コンストラクトを利用してHelloメッセージを返すLambda関数を作成するだけのコード
 */

import * as cdk from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SimpleLambdaL2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda用のIAM RoleはFunctionコンストラクト側で用意されているので、今回はIAM Roleは別途作成しない
    // lambdaに付与する信頼ポリシー (信頼ポリシーのみで、許可ポリシーは無し)
    // const role = new Role(this, 'LambdaRole', {
    //   assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    // });

    // Lambda関数リソース (関数本体はインライン形式で記述)
    new Function(this, 'MyLamdba', {
      handler: 'index.handler',
      runtime: Runtime.NODEJS_22_X,
      // role: role,
      code: Code.fromInline(`
          exports.handler = async(args) => {
            let response = {
              statusCode: 200,
              body: JSON.stringify("Hello From Lambda")
            };
            return response;
          }
        `)
    });
  }
}
