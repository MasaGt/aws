/**
 * S3バケットのみを持つスタック
 */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Annotations, aws_s3 as s3 } from 'aws-cdk-lib';

export class ValidationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // バケット名をコンテキストから取得
    let bucketName = this.node.tryGetContext("bucketName");
    
    // バケット名のバリデーション処理
    if (!bucketName) {
      Annotations.of(this).addError("バケット名がコンテキストにて指定されていません");
      bucketName = "default-my-bucket";
    }

    // S3バケットを作成
    new s3.Bucket(this, "MyBucket", {
      bucketName: bucketName,
      versioned: false
    });

  }
}