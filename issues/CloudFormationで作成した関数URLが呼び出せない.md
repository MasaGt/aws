### 事象

- 以下のテンプレートファイルから関数 URL を作成し、アクセスしようとしたら Forbidden が表示されてしまう

    <img src="../img/Issue-CloudFormation-FunctionUrls_1.svg" />

    <img src="../img/Issue-CloudFormation-FunctionUrls_2.svg" />

---

### 原因

- Lambda 関数に、関数 URL を正常に呼び出すためのアクセス許可である `lambda:InvokeFunctionUrl` を付与していなかった

<br>
<br>

参考サイト

[Lambda 関数 URL へのアクセスの制御](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/urls-auth.html)

---

### 解決策

- 今回は、認証タイプが `NONE` = 全てのユーザーからのアクセスを許可する関数 URL を作成するので、関数 URL (Lambda 関数) にアタッチするリソースベースのポリシーを作成する

    = AWS::Lambda::Permission をテンプレート内で定義する

    <img src="../img/Issue-CloudFormation-FunctionUrls_3.svg" />

    <img src="../img/Issue-CloudFormation-FunctionUrls_4.svg" />

<br>
<br>

参考サイト

[Lambda Function URLをCloudFormationやCDKで作る](https://qiita.com/a_b_/items/4d605af2cbb64c3d8ba5)