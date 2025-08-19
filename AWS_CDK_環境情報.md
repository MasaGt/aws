### 「環境」とは

- CDK から作成する AWS スタックをデプロイする対象の **AWS アカウント (ID) とリージョン**の組み合わせを CDK では「環境 (Environement)」と定義される

<br>
<br>

参考サイト

[もっとじっくり AWS CDK のコンセプト 第9回 コンテキストと「環境」](https://www.ogis-ri.co.jp/otc/hiroba/technical/cdk-concepts/part9.html)

[AWS CDK の環境](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/environments.html)

---

### 「環境」はどのように利用されるのか?

- スタックにはデプロイ先を決定するため、必ず環境が設定されなければならない

<br>

- 1つの CDK プロジェクトの複数スタックに異なる環境を設定することで、1回のデプロイでマルチリージョンなリソースのデプロイも可能

    <img src="./img/AWS-CDK-Environment_1.svg" />

    <br>

    <img src="./img/AWS-CDK-Environment_2.svg" />

<br>
<br>

[AWS CDK で使用する環境を設定する](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/configure-env.html)

---

### 「環境」の設定方法

#### 1. ハードコーディング

- Stack クラス作成時に、第3引数 (StackProps) の evn プロパティにてアカウント ID とリージョンをハードコーディングする方法

    ```js
    //Stackクラスのインスタンス作成
    new MyDevStack(app, 'MyDevStack', {
        env: {
            account: "1111111111",
            region: "us-east-1"
        }
    });
    ```

<br>
<br>

#### 2. process.env 変数を利用する

- cdk コマンドに --profile オプションをつけて実行すると、CDK は`process.env.CDK_DEFAULR にアカウントID` を、`process.env.CDK_DEFAULT_REGION にリージョン` を自動で設定する

    ```js
    //Stackクラスのインスタンス作成
    new MyDevStack(app, 'MyDevStack', {
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION
        }
    });
    ```

    ```bash
    npx aws-cdk deploy --profile <プロファイル名>
    ```

<br>

- cdk コマンドにいちいち --profile オプションをつけるのがめんどくさい場合は cdk.json に profile を事前に定義することも可能

    ```json
    #cdk.json
    {
        "profile": "<プロファイル名>"
    }
    ```

<br>
<br>

#### 3. environment-agnostic Stacks

- 環境情報を設定しない

    ```js
    // 第3引数で、envを設定しないスタック
    new MyDevStack(app, 'MyDevStack');
    ```

<br>
<br>

参考サイト

[AWS CDK で使用する環境を設定する](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/configure-env.html#configure-env-how)

---

### environment-agnostic Stacks とは

- 環境情報が指定されてないスタックのこと

    - deploy 時のプロファイル情報をもとに環境を決定する

    <br>

    - ★default プロファイルがない場合、 --ptofile で指定しなければならない

<br>

#### ポイント

- environment-agnostic Stacks では環境情報は deploy 時に設定される

    <img src="./img/AWS-CDK-Environment-Agnostic-Stacks-Process_1.svg" />

<br>

- [context メソッド](./AWS_CDK_コンテキスト.md#cdkcontextjson-とは)は synth 時に環境情報を利用して AWS リソースの情報などを検索するので、**environment-agnostic Stacks で context メソッドは使えない**

    <img src="./img/AWS-CDK-Environment-Agnostic-Stacks_1.svg" />

<br>
<br>

- [environment-agnostic Stacks + --profile オプションの利用](#environment-agnostic-stacks-とは) と [process.env + --profile オプションの利用](#2-processenv-変数を利用する)の違いは、いつプロファイルに紐づく環境情報が設定されるか

    - environment-agnostic Stacks + --profile オプションの利用

        - deploy 時に --profile で指定されたプロファイルに紐づく AWS アカウント ID とリージョンが設定される

    <br>
    
    - process.env + --profile オプションの利用
        - synth 時に --profile で指定されたプロファイルに紐づく AWS アカウント ID とリージョンが設定される

<br>
<br>

#### environment-agnostic Stacks を利用すると何が嬉しいのか?

- アカウント依存のコードが書けなくなる → 汎用的な CDK プロジェクトを作成することができる

    <img src="./img/AWS-CDK-Environment-Agnostic-Stacks_2.svg" />

    
<br>
<br>

参考サイト

[もっとじっくり AWS CDK のコンセプト 第9回 コンテキストと「環境」](https://www.ogis-ri.co.jp/otc/hiroba/technical/cdk-concepts/part9.html)

[AWS CDK で使用する環境を設定する](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/configure-env.html#configure-env-how)