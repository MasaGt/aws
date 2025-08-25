/**
 * ただのContructクラス
 * コンストラクトモジュールをテストする練習のために作成
 */

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class LambdaConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    //ただLambda関数リソースを作るだけ
    new cdk.aws_lambda.Function(this, "MyLamdba1", {
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
  }
}
