### 事象

- ECR にプッシュした Docker イメージから CloudFormation で Lambda 関数を作成しようとしたが `Value 'runtime' is required` エラーで Lambda 関数の作成ができなかった

<br>

- 関数ファイル

    <img src="../img/Issue-CloudFormation-Lambda-from-Image_1.svg" />

<br>

- Dockerfile

    <img src="../img/Issue-CloudFormation-Lambda-from-Image_2.svg" />

<br>

- CloudFormation テンプレートファイル

    <img src="../img/Issue-CloudFormation-Lambda-from-Image_3.svg" />

<br>

- エラー内容

    <img src="../img/Issue-CloudFormation-Lambda-from-Image_6.svg" />

---

### 原因

- CloudFormation テンプレートファイルにて、 `AWS::Lambda::Function` リソースの PackageType 要素に Image を指定していなかった

    <img src="../img/Issue-CloudFormation-Lambda-from-Image_4.svg" />

    引用: [AWS::Lambda::Function](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/TemplateReference/aws-resource-lambda-function.html)

<br>
<br>

参考サイト

[AWS::Lambda::Function](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/TemplateReference/aws-resource-lambda-function.html)

[コンテナイメージ版AWS Lambda関数をCloudFormationでデプロイしてみた](https://dev.classmethod.jp/articles/deploy-container-image-lambda-function-with-cloudformation/)

---

### 解決法

- CloudFormation テンプレートを修正

    - `AWS::Lambda::Function` リソースの PackageType 要素に Image を指定

<br>

<img src="../img/Issue-CloudFormation-Lambda-from-Image_5.svg" />