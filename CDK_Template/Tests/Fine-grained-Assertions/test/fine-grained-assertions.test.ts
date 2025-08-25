import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as FineGrainedAssertions from "../lib/fine-grained-assertions-stack";

describe("Contextのテスト例" , () => {
  test('contextをテストコード中で設定するバージョン', () => {
      const app = new cdk.App();
      // contexを設定
      const envContext = "dev";
      app.node.setContext("env", envContext);
      const systemNameContext = "system-001";
      app.node.setContext("sys", systemNameContext);
  
      const stack = new FineGrainedAssertions.FineGrainedAssertionsStack(app, "MyStack");
  
      // テンプレート(JSON)を生成
      const template = Template.fromStack(stack);
      // console.log(template);

      template.hasResourceProperties("AWS::Lambda::Function", {
        Tags: [
          {
            Key: "MyLambdaTag",
            Value: `${envContext}-${systemNameContext}`
          }
        ]
      });
  });
  
  test("contextをundefinedとして評価するバージョン", () => {
    const app = new cdk.App();
    const stack = new FineGrainedAssertions.FineGrainedAssertionsStack(app, "MyStack");
  
    // テンプレート(JSON)を生成
      const template = Template.fromStack(stack);
  
      template.hasResourceProperties("AWS::Lambda::Function", {
        Tags: [
          {
            Key: "MyLambdaTag",
            Value: "undefined-undefined"
          }
        ]
      });
  });
});

describe("Templateの代表的なテストメソッドを使った例", () => {

  //複数のテストケースから参照されるものはグローバル変数として定義
  const targetResource = "AWS::Lambda::Function";
  let app: cdk.App;
  let stack: FineGrainedAssertions.FineGrainedAssertionsStack;
  let template: Template;
  
  // 事前準備
  beforeAll(() => {
    app = new cdk.App();
    stack = new FineGrainedAssertions.FineGrainedAssertionsStack(
      app,
      "MyTestStack"
    );
    template = Template.fromStack(stack);
  });
  
  // スタックにあるLambda関数の数の確認テスト
  test("Check Lambda Function Nums", () => {
    // Lambda関数リソース数が２つであること
    template.resourceCountIs(targetResource, 2);
  });
  
  // スタックにあるRuntimeがnodejs22.xのLambda関数の数の確認テスト
  test("Check Node.js_22 Lambda Function Nums", () => {
    // nodejs22.xがRuntimeのLambda関数リソースは1つであること
    template.resourcePropertiesCountIs(
      targetResource,
      { Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name },
      1
    );
  });
  
  // (hasResource版) スタックのLambda関数リソースにRuntimeがnodejs22.xが設定されているものが存在するかテスト
  test("hasResource Test", () => {
    template.hasResource(targetResource, {
      Properties: {
        Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name,
      },
    });
  });
  
  // (hasResourceProperties版) スタックのLambda関数リソースにRuntimeがnodejs18.xが設定されているものが存在するかテスト
  test("hasResourceProperties Test", () => {
    template.hasResourceProperties(targetResource, {
      Runtime: cdk.aws_lambda.Runtime.NODEJS_18_X.name,
    });
  });
  
  // (allResources版) 全てのLambda関数リソースのRuntimeがnodejs22.xであることをテスト
  // ★このテストケースはこけていい
  test("allResources Test", () => {
    template.allResources(targetResource, {
      Properties: {
        Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name,
      }
    });
    // 失敗: 他にnodejs18.xのLambda関数もスタックの中にあるから
  });
  
  // (allResourcesProperties版) 全てのLambda関数リソースのRuntimeがnodejs18.xであることをテスト
  // ★このテストケースはこけていい
  test("allResourcesProperties Test", () => {
    template.allResourcesProperties(targetResource, {
      Runtime: cdk.aws_lambda.Runtime.NODEJS_18_X.name,
    });
    // 失敗: 他にnodejs22.xのLambda関数もスタックの中にあるから
  });
  
  // スタックにある2つのLambda関数のうち1つのRuntimeはnodejs18.x、もう1つのRuntimeがnodejs22.xであることのテスト
  test("findResources Test", () => {
      const lambdaResources = template.findResources(targetResource);
      // nodejs18.xランタイムを持つLambdaをフィルター
      const nodeJs18Lambda = Object.values(lambdaResources).filter((resource: any) => {
        return resource.Properties.Runtime === cdk.aws_lambda.Runtime.NODEJS_18_X.name;
      });
  
      // nodejs22.xランタイムを持つLambdaをフィルター
      const nodeJs22Lambda = Object.values(lambdaResources).filter((resource: any) => {
        return resource.Properties.Runtime === cdk.aws_lambda.Runtime.NODEJS_22_X.name;
      });
  
      // テストとして、nodejs18.xランタイムのLambdaが1つ、nodejs22.xランタイムのLambdaが1つあることを確認
      expect(nodeJs18Lambda.length).toBe(1);
      expect(nodeJs22Lambda.length).toBe(1);
  });
});
