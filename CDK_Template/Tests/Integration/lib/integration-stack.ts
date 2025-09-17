/**
 * API Gatewat + カスタムオーソライザー(Lambda) + Dynamo + 本体となるLambda関数 で構成するスタックモジュール
 */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_apigatewayv2 as ApiGateway, aws_apigatewayv2_authorizers as ApiGatewayAuthorizer, aws_apigateway as ApiGatewayV1 } from 'aws-cdk-lib';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_dynamodb as db, RemovalPolicy } from "aws-cdk-lib";
import * as path from 'path';

export class IntegrationStack extends cdk.Stack {
  public readonly endpointURL: string;
  public readonly userTable: string;
  public readonly functionName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ユーザーテーブル
    const table = new db.TableV2(this, "MyDynamoable", {
        partitionKey: {
            name: "user_id",
            type: db.AttributeType.STRING
        },
        tableName: "UserTable",
        removalPolicy: RemovalPolicy.DESTROY
    });
    this.userTable = table.tableName;

    // 認証用Lambda関数の定義
    const authorizer = new lambda.Function(this, "MyAuthorizer", {
        handler: "authorizer.handler",
        runtime: lambda.Runtime.NODEJS_22_X,
        code: lambda.Code.fromAsset(path.join(__dirname, '../resources')),
        environment: {
            TABLE_NAME: table.tableName
        }
    });

    //認証関数にdynamoへのアクセス(getObject)を許可
    table.grantReadData(authorizer);


    //API Gatewayの接続先となるLambda関数
    const targetFunction = new lambda.Function(this, "TargetLambda", {
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset(path.join(__dirname, '../resources')),
      functionName: "Greeting"
    });


    //API Gateway(HTTP APIタイプ)
    const apiGateway = new ApiGateway.HttpApi(this, "MyHttpApi");
    //統合先(接続先のバックエンドリソース)の定義
    const integrationConfig = new HttpLambdaIntegration("Target", targetFunction);

    //Authorizer定義
    const lambdaAuthorizerConfig = new ApiGatewayAuthorizer.HttpLambdaAuthorizer("AuthorizerForGreeting", authorizer, {
      // responseTypes: [
      //   ApiGatewayAuthorizer.HttpLambdaResponseType.IAM,
      //   ApiGatewayAuthorizer.HttpLambdaResponseType.SIMPLE
      // ],
      // responseTypes: [ApiGatewayAuthorizer.HttpLambdaResponseType.IAM],
      responseTypes: [ApiGatewayAuthorizer.HttpLambdaResponseType.SIMPLE],
      identitySource: [
        '$request.header.Auth',
        '$request.querystring.user_id'
        // 'method.request.header.Auth',
        // 'method.request.querystring.user_id'
      ],
    });


    //パスの追加+統合先の設定
    apiGateway.addRoutes({
      path: "/greeting",
      methods: [ApiGateway.HttpMethod.GET],
      integration: integrationConfig,
      authorizer: lambdaAuthorizerConfig
    });

    //エスケープハッチ的ハック
    // const cfnAuthorizer = apiGateway.node.findChild("AuthorizerForGreeting").node.defaultChild as ApiGateway.CfnAuthorizer;
    // cfnAuthorizer.addOverride('Properties.AuthorizerPayloadFormatVersion', '2.0');
    // cfnAuthorizer.enableSimpleResponses = false;
    
    this.endpointURL = `${apiGateway.apiEndpoint}/greeting`;
  }
}
