/**
 * S3に対してのプロパティチェック (Aspect)
 */

import { IAspect, Token } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { aws_s3 as s3 } from "aws-cdk-lib";

export class S3Aspect implements IAspect {
    visit(node: IConstruct): void {
        if (node instanceof s3.CfnBucket) {
            
            //バージョニングが有効じゃ無い場合はエラーを投げる
            if (
                !node.versioningConfiguration ||
                (
                    !Token.isUnresolved(node.versioningConfiguration) &&
                    (node.versioningConfiguration as s3.CfnBucket.VersioningConfigurationProperty).status !== "Enabled"
                )
            )
            {
                throw new Error("バケットのバージョニングが有効になっていません");
            }
        }
    }
}