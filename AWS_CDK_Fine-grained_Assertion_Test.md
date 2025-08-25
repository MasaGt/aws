### CDK の Fine-grained Assertions Test

#### 概要

<img src="./img/AWS-CDK-Fine-grained-Assertions-Test_1.svg" />

<br>

- CDK における Fine-grained Assertions Test とは

    - 要するに、スタックやそのスタックに属するリソース(コンストラクト)に対するアサーションテスト

        <img src="./img/Assertion-Test_1.svg" />

<br>

#### Fine-grained Assertions テストの例

<img src="./img/AWS-CDK-Fine-grained-Assertions-Test_2.svg" />

<br>

#### ポイント

- テスト時に生成するテンプレート (json) に対してテストを行う

    - テンプレート (json) は内部で生成するが、[Snapshot テスト](./AWS_CDK_Snapshot_Test.md)のようにテンプレートファイルを外部ファイルとして保存することはしない

    <br>

    - ★CDK アプリ側のリソース (コンストラクト) のプロパティと jest 側でのリソースのプロパティは同じではない

        <img src="./img/AWS-CDK-Fine-grained-Assertions-Test-Point_1.svg" />

        <img src="./img/AWS-CDK-Fine-grained-Assertions-Test-Point_2.svg" />

<br>

- 詳細なテストができるが、詳細にしすぎるとテストコードの記述量が増えてしまい、テストの作成やメンテナンスにコストがかかる傾向にある

    - どこまでテストを行うかについては[こちら](#cdk-でアサーションテストの対象とすべき対象は)を参照

<br>
<br>

参考サイト

[AWS CDK 入門 - アサーションテストの基本](https://www.ctc-g.co.jp/solutions/cloud/column/article/96.html)

---

### 代表的なテストメソッド

```ts
/**
 * テスト対象スタックモジュール
 */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

// 2つのLambda関数を持つスタック
export class TestTargetStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数の本体となるコード
    const code = `
        exports.handler = async(args) => {
            let response = {
                statusCode: 200,
                body: JSON.stringify("Hello From Lambda")
            };
            return response;
        }
    `;

    // Lambda関数リソース1 (Node_22)
    new cdk.aws_lambda.Function(this, "MyLamdba", {
        handler: "index.handler",
        runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
        code: cdk.aws_lambda.Code.fromInline(code)
    });

    // Lambda関数リソース2 (Node_18)
    new cdk.aws_lambda.Function(this, "MyLamdba2", {
        handler: "index.handler",
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        code: cdk.aws_lambda.Code.fromInline(code)
    });
  }
}
```

<br>

#### `Template.resourceCountIs(type: string, count: number)`

- 指定した種類のリソースの数をテストするのに使う

    ```ts
    /**
     * Testファイル
    */
    import * as cdk from "aws-cdk-lib";
    import { Template } from "aws-cdk-lib/assertions";
    import * as TestTargetStack from "<テスト対象のstack>";

    test("スタック中のLambda関数リソースの数をテスト", () => {
        const app = new cdk.App();
        const stack = new TestTargetStack(app, "MyStack");

        // テンプレート(json)の生成
        const template = Template.fromStack(stack);

        // ★テスト対象スタックのLambda関数リソースは2つであることをテスト
        template.resourceCountIs("AWS::Lambda::Function", 2);
        // →成功
    });
    ```

<br>

#### `Template.resourcePropertiesCountIs(type: string, props: any, count: number)`

- 指定した種類 + 指定したプロパティと設定値を持つリソースの数をテストするのに使う

    ```ts
    /**
     * Testファイル
    */
    import * as cdk from "aws-cdk-lib";
    import { Template } from "aws-cdk-lib/assertions";
    import * as TestTargetStack from "<テスト対象のstack>";

    test("スタック中のRuntimeはNode22のLambda関数リソースの数をテスト", () => {
        const app = new cdk.App();
        const stack = new TestTargetStack(app, "MyStack");

        // テンプレート(json)の生成
        const template = Template.fromStack(stack);

        // ★テスト対象スタックのLambda関数リソース (RuntimeプロパティはNode_22) は1つであることをテスト
        template.resourcePropertiesCountIs(
            "AWS::Lambda::Function",
            { Runtim: cdk.aws_lambda.Runtime.NODEJS_22_X.name },
            1
        );
        // →成功
    });
    ```

<br>

#### `Template.hasResourceProperties(type: string, props: any)`

- 指定した種類のリソースが、指定したプロパティと設定値を持つかどうかをテストする

- 指定した全てのプロパティと設定値を持つリソースが1つでもあれば成功

    ```ts
    /**
     * Testファイル
    */
    import * as cdk from "aws-cdk-lib";
    import { Template } from "aws-cdk-lib/assertions";
    import * as TestTargetStack from "<テスト対象のstack>";

    test("スタック中のLambda関数にRuntimeにNode_22が設定されているかのテスト", () => {
        const app = new cdk.App();
        const stack = new TestTargetStack(app, "MyStack");

        // テンプレート(json)の生成
        const template = Template.fromStack(stack);

        // RuntimeがNode_22であるLambda関数があれば成功。そうでなければ失敗
        template.hasResourceProperties(
            "AWS::Lambda::Function",
            { Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name }
        );
        // →成功

        // 以下のテストケースは失敗する (RuntimeがNode_22のLambda関数はあるが、Handlerは "index.handler"でマッチしないため)
        template.hasResourceProperties(
            "AWS::Lambda::Function",
            {
                Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name,
                Handler: "index.main"
            }
        );
        // →失敗
    });
    ```

<br>

#### `Template.allResourcesProperties(type: string, props: any)`

- 指定した種類のリソース**全て**が、指定したプロパティと設定値を持つかどうかをテストする

- `Template.hasResourceProperties()` とは異なり、指定した種類のリソース全てが指定したプロパティと設定値を持たないと `Template.allResourcesProperties()` は失敗する

    ```ts
    /**
     * Testファイル
    */
    import * as cdk from "aws-cdk-lib";
    import { Template } from "aws-cdk-lib/assertions";
    import * as TestTargetStack from "<テスト対象のstack>";

    test("スタック中の全てのLambda関数リソースのRuntimeについてのテスト", () => {
        const app = new cdk.App();
        const stack = new TestTargetStack(app, "MyStack");

        // テンプレート(json)の生成
        const template = Template.fromStack(stack);

        // ★スタック中のLambda関数リソースの「全て」がRuntimeにNode_22を設定されているかテスト
        template.allResourcesProperties(
            "AWS::Lambda::Function",
            {
                Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name
            }
        );
        // →失敗(Node_18がRuntimeのLambda関数がスタック中に存在するから)
    });
    ```

<br>

#### `Template.hasResource(type: string, props: any)`

- 指定した種類のリソースが、指定したプロパティと設定値を持つかどうかをテストする

- `Template.hasResourceProperties()` との違いについては[こちら](#hasresource-と-hasresourceproperties-の違い)を参照

    ```ts
    /**
     * Testファイル
    */
    import * as cdk from "aws-cdk-lib";
    import { Template } from "aws-cdk-lib/assertions";
    import * as TestTargetStack from "<テスト対象のstack>";

    test("スタック中のLambda関数にRuntimeにNode_22が設定されているかのテスト", () => {
        const app  = new cdk.App();
        const stack = new TestTargetStack(app, "MyStack");

        // テンプレート(json)の生成
        const template = Template.fromStack(stack);

        // RuntimeがNode_22であるLambda関数があれば成功。そうでなければ失敗
        template.hasResource(
            "AWS::Lambda::Function",
            { 
                Properties: {
                    Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name,
                }
            }
        );
        // →成功
    })
    ```

<br>

#### `Template.allResources(type: string, props: any)`

- 指定した種類のリソース**全て**が、指定したプロパティと設定値を持つかどうかをテストする

- `Template.allResourcesProperties()` との違いについては[こちら](#allresources-と-allresourceproperties-の違い)を参照

    ```ts
    /**
     * Testファイル
    */
    import * as cdk from "aws-cdk-lib";
    import { Template } from "aws-cdk-lib/assertions";
    import * as TestTargetStack from "<テスト対象のstack>";

    test("スタック中の全てのLambda関数リソースのRuntimeについてのテスト", () => {
        const app = new cdk.App();
        const stack = new TestTargetStack(app, "MyStack");

        // テンプレート(json)の生成
        const template = Template.fromStack(stack);

        // ★スタック中のLambda関数リソースの「全て」がRuntimeにNode_22を設定されているかテスト
        template.allResourcesProperties(
            "AWS::Lambda::Function",
            {
                Properties: {
                    Runtime: cdk.aws_lambda.Runtime.NODEJS_22_X.name
                }
            }
        );

        // →失敗(Node_18がRuntimeのLambda関数がスタック中に存在するから)
    });
    ```

<br>

#### ★上記以外の方法として、jest が提供するテストメソッド (expect().toBe() や expect().toBeTruthy() など) を使って判定しても良い

- その場合、`Template.findResources(type: string, props?: any)` を利用するケースが多い

    ```ts
    /**
     * Testファイル
    */
    import * as cdk from "aws-cdk-lib";
    import { Template } from "aws-cdk-lib/assertions";
    import * as TestTargetStack from "<テスト対象のstack>";

    // スタックにある2つのLambda関数のうち1つのRuntimeはNode,js_18、もう1つのRuntimeがNode.js_22であることのテスト
    test("スタック中の全てのLambda関数リソースのRuntimeについてのテスト", () => {
        const app = new cdk.App();
        const stack = new TestTargetStack(app, "MyStack");

        // テンプレート(json)の生成
        const template = Template.fromStack(stack);

        // ★関数リソースの取得
        const lambdas = template.findResources("AWS::Lambda::Function");

        // Node.js_18_Xランタイムを持つLambdaをフィルター
        const nodeJs18Lambda = Object.values(lambdaResources).filter((resource: any) => {
        return resource.Properties.Runtime === cdk.aws_lambda.Runtime.NODEJS_18_X.name;
        });

        // Node.js_22_Xランタイムを持つLambdaをフィルター
        const nodeJs22Lambda = Object.values(lambdaResources).filter((resource: any) => {
        return resource.Properties.Runtime === cdk.aws_lambda.Runtime.NODEJS_22_X.name;
        });

        // テストとして、Node.js_18_XランタイムのLambdaが1つ、Node.js_22_XランタイムのLambdaが1つあることを確認
        expect(nodeJs18Lambda.length).toBe(1);
        expect(nodeJs22Lambda.length).toBe(1);
    });
    ```

<br>

#### ★hasResource() と hasResourceProperties() の違い

- 第2引数に指定する props が何を意味しているのかが微妙に違う

    - hasResource() における第2引数の props: テンプレートファイルの Rerouseces に定義された各リソースの各セクションの内容に対してマッチングを行う (Properties 以外のセクションもマッチングの対象)

    <br>

    - hasResourceProperties() における第2引数の props: テンプレートファイルの Rerouseces に定義された各リソースの **Properties セクションの内容に対してのみマッチングを行う**

    <br>

    <img src="./img/AWS-CDK-Assertions-Test-Resource-Methods-Diff_1.svg" />

<br>

#### allResources() と allResourcesProperties() の違い

- [hasResource() と hasResourceProperties() の違い](#hasresource-と-hasresourceproperties-の違い)と同じ

    - allResources メソッドの第2引数の props は Properties 以外のセクションもマッチングの対象
    
    <br>

    - allResourcesProperties メソッドの第2引数の props はテンプレートファイルの Rerouseces に定義された各リソースの Properties セクションの内容に対してのみマッチングを行う

<br>

#### ★`Template.findResources(type: string, props: any)` について

- ★第2引数は hasResource() や allResouces() と同じく **Properties 以外の Resources セクションの属性もマッチングの対象とする props**

<br>

- ★戻り値はただのオブジェクト

<br>

<img src="./img/AWS-CDK-Assertions-Test-findResources_1.svg" />

<br>
<br>

参考サイト

[AWS CDK 入門 - アサーションテストの基本]()

[【AWS CDKテスト入門】Assertionテストのテストパターン ~Templateメソッド編~](https://qiita.com/pensuke628/items/5f57f3ab492af2227f91)

[class Template](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html)

[リソース属性リファレンス](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/TemplateReference/aws-product-attribute-reference.html)

---

### Context のテストはどうする?

- 当然だが、jest は --context オプションをサポートしていないので、context を渡すことができない

    <img src="./img/AWS-CDK-Test-Context_1.svg" />

<br>

- jest で context を利用したい場合 **テストコード中で node.setContext() で contex を設定する** or **テスト時には Context の値を undefine で評価**する必要がある

    <img src="./img/AWS-CDK-Context-Test_1.svg" />

    <br>

    <img src="./img/AWS-CDK-Context-Test_2.svg" />

<br>
<br>

参考サイト

[実践！AWS CDK #4 Context - 注意](https://dev.classmethod.jp/articles/cdk-practice-4-context/#toc-5)

[今から始める CDK 入門 #4](https://zenn.dev/mn87/articles/dcd99734b8bb05#テスト時の注意)

---

### おまけ

- #### テスト対象が Stack ではなく Contruct の場合、テストコード中で App ではなく Stack から作成してもいい

    <img src="./img/AWS-CDK-Construct-Test_1.svg" />

<br>

- #### 自明なテストまで書くべき?

    - 「StackA に Lambda 関数が存在すること」のような**CDK アプリ側のコードを読めばすぐわかるようなこと**までテストする必要があるか

        - →テストコードは仕様書にもなり得る = そのテストコードに

        - ★しかし、上記のようなケースはスタックのアーキテクチャー図を別途用意すればテストコードは書かなくてもいいと**個人的に**思う

<br>

- #### CDK でアサーションテストの対象とすべき対象は?

     - [こちらの記事](https://aws.amazon.com/jp/builders-flash/202411/learn-cdk-unit-test/)がとても参考になる

        1. **ループ処理でリソースを作成している**場合、そのループ処理が正しく動いているかをテストする必要がある

            ```ts
            /**
             * アプリ側
            */
            import * as cdk from 'aws-cdk-lib';

            export Sample extends cdk.Stack {
                constructor(scope: Construct, id: string, props?: any) {
                    super(scope, id);

                    // propsから条件を取得してもいい
                    for (prop.num) {
                        //　★条件に応じて複数のEC2インスタンスを作成する
                        new cdk.aws_ec2.Instance(~~);
                    }
                }
            }
            ```

            <br>

            ```ts
            /**
             * テストコード
             */
            import * as cdk from 'aws-cdk-lib';
            import { Template } from "aws-cdk-lib/assertions";
            import { Sample } from "<テスト対象モジュールのパス>"

            test("Sampleスタックの中のEC2インスタンスが条件通りに作成されているかのテスト", () => {
                const app = new cdk.App();
                const stack = new Sample(app, "<スタック名>", { num: 10 });

                // テンプレート(JSON)の生成
                const template = Template.fromStack(stack);

                // ★テスト対象のスタックにEC2インスタンスが条件通りに作成されているかテスト
                Template.resourceCountIs("AWS::EC2::Instance", 10);
            });
            ```
        
        <br>

        2. **条件分岐でリソースを作成している**場合、分岐処理が正しく機能しているかテストする必要がある

            ```ts
            /**
             * アプリ側
            */
            import * as cdk from 'aws-cdk-lib';

            export Sample extends cdk.Stack {
                constructor(scope: Construct, id: string, props?: any) {
                    super(scope, id);

                    // dev環境にはT2.micro prod環境にはM5.largeでデプロイする
                    let instanceType: cdk.aws_ec2.InstanceType;

                    // 条件によって作成するEC2インスタンスのインスタンスタイプが異なる
                    if (props.env === "dev") {
                        //　★T2マイクロ
                        instanec.instanceType = cdk.aws_ec2.InstanceType.of(
                                                    cdk.aws_ec2.InstanceClass.T2,
                                                    cdk.aws_ec2.InstanceSize.MICRO
                                                );
                    } else if (props.env === "prod") {
                        instanec.instanceType = cdk.aws_ec2.InstanceType.of(
                                                    cdk.aws_ec2.InstanceClass.M5,
                                                    cdk.aws_ec2.InstanceSize.LARGE
                                                );
                    }

                    new cdk.aws_ec2.Instacne(~~);
                }
            }
            ```

            <br>

            ```ts
            /**
             * テストコード
             */
            import * as cdk from 'aws-cdk-lib';
            import { Template } from "aws-cdk-lib/assertions";
            import { Sample } from "<テスト対象モジュールのパス>"

            test("Sampleスタックの中のEC2インスタンスが条件通りに作成されているかのテスト", () => {
                const app = new cdk.App();
                const stack = new Sample(app, "<スタック名>", { env: "prod" });

                // テンプレート(JSON)の生成
                const template = Template.fromStack(stack);

                /**
                 *  ★env: "dev"という外部からの値に対して、正しくEC2リソースが作成されているかをテスト
                 */
                // スタック中の全てのEC2インスタンス数のテスト
                template.resourceCountIs("AWS:EC2::Instance", 1); 
                // スタック中のEC2インスタンスのインスタンスタイプが条件に応じたものかのテスト
                template.resourcePropertiesCountIs(
                    "AWS:EC2::Instance",
                    { InstanceType: "m5.large" },
                    1
                );
            });
            ```

        <br>

        他にも、特に保証したい項目はテストで担保したり、L2コンストラクトで定義するリソースの設定項目を自分でカスタマイズするようなコードに対してのテストも有効

<br>
<br>

参考サイト

[AWS CDK における単体テストの使い所を学ぶ](https://aws.amazon.com/jp/builders-flash/202411/learn-cdk-unit-test/)