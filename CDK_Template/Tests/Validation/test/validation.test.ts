import * as cdk from "aws-cdk-lib";
import { ValidationStack } from "../lib/validation-stack";
import { S3Aspect } from "../lib/s3-aspect";
import { Annotations, Template } from 'aws-cdk-lib/assertions';
import { Aspects } from "aws-cdk-lib";

describe("バリデーションテスト: コンテキスト-bucketName", () => {
  test("正常なケース: コンテキストにbucketNameがある", () => {
    // ↓Appのコンストラクタ引数にoutdirを指定すると、app.synth()でもクラウドアッセンブリが出力される
    // const app = new cdk.App({ outdir: "cdk.test.out" });
    const app = new cdk.App();
    // バケット名のセット (コンテキスト)
    app.node.setContext("bucketName", "my-bucket");
    const stack = new ValidationStack(app, "MyStack");

    const template = Template.fromStack(stack);
    // コンテキストで渡したバケット名でS3バケットが作成されてるか確認
    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketName: "my-bucket",
    });
  });

  test("異常なケース: コンテキストにbucketNameがない", () => {
    // s3バケットのバージョニング設定を有効にしないことでエラーを発生させる
    const app = new cdk.App();
    const stack = new ValidationStack(app, "MyStack");

    // ★★★スタックに付与された注釈情報を取得★★★
    const annotations = Annotations.fromStack(stack);
    annotations.findError(
      "*",
      "バケット名がコンテキストにて指定されていません"
    );
  });
});

test("S3バケットのバージョニング設定のバリデーション処理のテスト", () => {
  const app = new cdk.App();
  // バケット名のセット (コンテキスト) → Aspectのバリデーション処理をクリアするため
  app.node.setContext("bucketName", "my-bucket");
  const stack = new ValidationStack(app, "MyStack");
  Aspects.of(stack).add(new S3Aspect());

  expect(() => {
    app.synth();
    // ★以下のコードでもconstruct → synthesize フェーズの実行をトリガーする
    // const template = Template.fromStack(stack);
  }).toThrow("バケットのバージョニングが有効になっていません");
});