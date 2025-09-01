### CDK Annotations とは

- コンストラクトに関する注釈情報を記述するための機能

    - Info や Warning, Error など異なるレベルの注釈情報を追加することができる

<br>

- Annotations によって注釈情報が付けられた場合、コンソール画面にその情報が表示される

---

### 使い方

- #### Info (情報)をアタッチする場合

    - `Annotations.of(scope: IConstruct).addInfoV2(id: string, message: string)`

    - Annotations.of(scope: IConstruct) の引数である scope は注釈情報をアタッチする対象となる Construct (App, Stack, L1/L2 コンストラクト)

        ```ts
        import * as cdk from 'aws-cdk-lib';

        export class MyStack extends cdk.Stack {
            constructor(scope: Construct, id: string, props?: cdk.StackProps) {
                super(scope, id, props);
                
                // ステージ情報をコンテキストから取得
                const stageInfo = this.node.tryGetContext("stage");

                // ★AnnotationsのaddInfoをログっぽく使う
                cdk.Annotations.of(this).addInfoV2('Stage Info', stageInfo);
            }
        }
        ```

<br>

- #### Warning (警告)をアタッチする場合

    - `Annotations.of(scope: IConstruct).addWarningV2(id: string, message: string)`

        ```ts
        import * as cdk from 'aws-cdk-lib';
        import { Construct } from 'constructs';

        /**
         * Contextから指定されるインスタンスタイプを元にEC2インスタンスを生成するStack
         */
        export class MyStack extends cdk.Stack {
            constructor(scope: Construct, id: string, props?: cdk.StackProps) {
                super(scope, id, props);

                // ステージ情報をコンテキストから取得
                const instanceType = this.node.tryGetContext("instaceType");
                // インスタンスタイプのバリデーション処理
                checkInstanceType(instanceType);

                //EC2インスタンス生成
                new cdk.aws_ec2.Instance(
                    this,
                    "MyEC2",
                    {
                        instanceType:  new cdk.aws_ec2.InstanceType(`${instanceType}.micro`)
                        ),
                        //他のプロパティは省略
                    }
                );
            }

            /** 
             * contextで指定されるinstanceTypeがT3であることをチェック
             * T1やT2が指定された場合場合、警告を表示
             * T系じゃない場合、エラーを投げる
             */
            private checkInstanceType = (instanceType: string) => {
                const oldInstanceType_T = ["t1", "t2"];

                if (
                    // コンテキストがundefinedじゃないこと
                    !instanceType || 
                    // 指定されたインスタンスタイプが<アルファベット><数字>の2文字で指定されてること
                    instanceType.length == 2 ||
                ) {
                    if (oldInstanceType_T.includes(instanceType)) {

                        // 指定されたインスタンスタイプがT1,T2の場合
                        // ★★★エラーにするほどでもない場合に便利なaddWarningV2()★★
                        cdk.Annotations.of(this).addWarningV2("InstanceTypeWarning", `指定されたインスタンスタイプ ${instanceType} は古いバージョンです`)
                    } else if (!instanceTyoe.startWith("t")) {

                        // 指定されたインスタンスタイプがT系ではない場合
                        throw Error("インスタンスタイプはT系で指定してください")
                    }
                } else {
                    // そもそも指定されたinstanceTypeの形式がおかしい場合
                    throw Error("指定されたインスタンスタイプは無効です")
                }
            }
        }
        ```

<br>

- #### Error (エラー)をアタッチする場合

    - `Annotations.of(scope: IConstruct).addError(message: string)`

    - [Aspects](./AWS_CDK_Aspects.md) でのバリデーション処理で引っかかった場合のエラーに利用されることが多い

        ```ts
        import * as cdk from 'aws-cdk-lib';
        import { IAspect, Aspects } from "aws-cdk-lib";
        import { IConstruct } from "constructs";
        import { Construct } from 'constructs';
        import * as ec2 from 'aws-cdk-lib/aws-ec2';

        /**
         * VPCリソースを持つStack
         */
        export class MyStack extends cdk.Stack {
            constructor(scope: Construct, id: string, props?: cdk.StackProps) {
                super(scope, id, props);

                // VPC作成
                const vpc = new ec2.Vpc(this, 'MyVpc', {
                    maxAzs: 4,
                });

                // 自身(Stack)にAspect設定
                Aspects.of(this).add(new VPCCidrAspect());
            }
        }

        /**
         * VPCのCIDR BlockをチェックするAspect
         */
        private class VPCCidrAspect implements IAspect {
            visit(node: IConstruct) {
                if (
                    // nodeがCfnVPCインスタンスであること
                    node instanceof ec2.CfnVPC &&
                    // CIDRBlockプロパティがTokenでないこと
                    !Token.isUnresolved(node.cidrBlock) &&
                    // CIDRBlockプロパティが設定されていること
                    node.cidrBlock
                ) {

                    // CIDRBlockプロパティが198.168で始まること
                    if (!node.cidrBlock.startsWith('192.168.')) {

                        // ★★★Annotationsでエラーをアタッチ★★★
                        Annotations.of(node).addError('VPCのCIDRは"192.168."の範囲にある必要があります');
                        }
                }
            }
        }
        ```

<br>

- #### アタッチされた注釈情報はどこに出力される?

    - Cloud Assembly (デフォルトでは./cdk.out) の manifest.json 中に出力される

        <img src="./img/AWS-CDK-Annotations-Output_1.svg" />

<br>
<br>

参考サイト

[class Annotations](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Annotations.html)

---

### 注意点

- ★`Annotations.of(scope: IConstruct).addError()` でコンストラクトにエラーがアタッチされていても `cdk synth` や `cdk deploy` はテンプレートの合成を中止しない

    <img src="./img/AWS-CDK-Annotations-addError-Lifecycle_1.svg" />

<br>

- ★★エラーがアタッチされている Stack, コンストラクト がある場合、`cdk deploy <エラーがアタッチされているスタック>`、 `cdk deploy --all` は失敗する

    <img src="./img/AWS-CDK-Annotations-Deploy-Stack-with-Error_1.svg" />

<br>

- ★★エラーがアタッチされている Stack, コンストラクト があっても、 `cdk deploy <エラーがアタッチされていないstack>` は成功する

    <img src="./img/AWS-CDK-Annotations-Deploy-Stack-with-Error_2.svg" />

<br>
<br>

参考サイト

[AWS CDK におけるバリデーションの使い分け方を学ぶ](https://aws.amazon.com/jp/builders-flash/202406/cdk-validation/)