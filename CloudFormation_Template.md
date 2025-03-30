### CloudFormation のテンプレートの構成

★ [Resources](#resources) のみ必須要素で、その他の要素は任意

- [AWSTemplateFormatVersion](#awstemplateformatversion)
- [Description](#description)
- [Metadata](#metadata)
- [Parameters](#parameters)
- [Mappings](#mappings)
- [Transform]()
- [Conditions](#conditions)
- [Resources](#resources)
- [Outputs](#outputs)

<br>

```json
// JSON ver
{
    "AWSTemplateFormatVersion": "",
    "Description": "",
    "Metadata": "",
    "Parameters": "",
    "Conditions": "",
    "Mappings": "",
    "Transform": [""],
    "Resources": "",
    "Outputs": "",
}
```

```YAML
# YAML ver
AWSTemplateFormatVersion:
Description:
Metadata:
Parameters:
Conditions:
Mappings:
Transform:
Resources:
Outputs:
```

<br>
<br>

参考サイト

[【初心者向け】AWS CloudFormation 入門！完全ガイド](https://zenn.dev/issy/articles/zenn-cfn-overview#テンプレートで利用できる共通変数)

[【AWS入門】CloudFormationとは｜基礎からわかりやすく解説](https://techmania.jp/blog/aws0009/#outline__5_2)

---

### AWSTemplateFormatVersion

- テンプレートのバージョン

- ★2025/03/14 時点で "2010-09-09" のみサポート (=利用可能)

---

### Description

- テンプレートについての説明

---

### Metadata

- [Parameters](#parameters)に定義されているパラメータをグループ化したり、CloudFront 画面での表示順を変えることができる

- 詳しくは[こちら](https://zenn.dev/ano/articles/c5eedcc31b30e2)などを参照

<br>
<br>

参考サイト

[[CloudFormation] Metadata セクションで入力パラメータを見やすく設定する](https://zenn.dev/ano/articles/c5eedcc31b30e2)

---

### Parameters

- 実行時 (リソース作成時) に必要となるパラメータを定義する要素

    ```yaml
    #定義
    Parameters:
        [パラメーター名]:
                Type: [データ型]
                Description: "パラメーターの説明"
                Default: [パラメーターのデフォルト値]
                AllowedValues: #このパラメータで許容される入力値
                    - [val1]
                    - [val2]
                    - [val3]

    #具体例
    Parameters:
        InstanceTypeParameter:
            Type: String
            Description: Enter t2.micro, m1.small, or m1.large.
            Default: t2.micro
            AllowedValues:
                - t2.micro
                - m1.small
                - m1.large
    ```

<br>

- イメージ的にはプログラミングでの変数の型定義

    - Resources 要素内で「この部分は Parameters の \~\~ の定義に従う」と参照することで、定義された型以外の入力があった場合エラーにする

    - ★[Ref](./CloudFormation_組み込み関数.md#ref) でそのパラメーター定義を参照することができる　

    ```yaml
    Resources:
        Ec2Instance:
            Type: AWS::EC2::Instance
            Properties:
                InstanceType:
                    Ref: InstanceTypeParameter #ここでインスタンスタイプの入力値をInstanceTypeParameterに従ったものに限定している
                    ImageId: ami-0ff8a91507f77f867
    ```

<br>
<br>

参考サイト

[CloudFormationのParametersの入力方法の違いをデータ型ごとに一覧にしてみた](https://dev.classmethod.jp/articles/list-of-cloudformation-parameters-by-data-type/)

---

### Mappings

- 特定キーに紐づくラベル (=セカンドレベルキー名) & 値の組み合わせを定義する要素

    ```yaml
    #定義
    Mappings:
        [マッピンググループ名]:
            [トップレベルキー名]:
                [セカンドレベル名]: [値]

    #具体例
    Mappings:
        RegionAndInstanceType:
            us-east-1: #トップレベルキー名
                instanceType: t2.micro #セカンドレベルキー名とValue
            eu-west-1:
                instanceType: t3.micro
    ```

<br>

- [Conditions](#conditions) 要素と組み合わされて利用されることが多い

<br>

- イメージ的にはプログラミングでのマップとほぼ同じ

<br>

- [Fn::FindInMap](./CloudFormation_組み込み関数.md#fnfindinmap) で Mappings の値を参照できる

    ```yaml
    Resources:
        myEC2Instance:
            Type: AWS::EC2::Instance
            Properties:
                ImageId: ami-0ff8a91507f77f867
                InstanceType: Fn::FindInMap [RegionAndInstanceType, !Ref "AWS::Region", instanceType] #ここでInstanceType には RegionAndInstanceType マップで定義された値を設定している
    ```

<br>
<br>

参考サイト

[初学者のためのCloudFormation超入門（テンプレート編）](https://www.isoroot.jp/blog/6760/)

---

### Conditions

- 条件名と条件判断内容を定義する要素

<br>

- Conditions 要素の条件を Resource 要素内のプロパティなどに適用することで、その条件結果によってリソースの制御が可能になる

    ```yaml
    ＃定義
    Conditions:
        [条件名]: [状況判断内容]

    #具体例
    Parameters:
        BoolValue:
            Default: true

    #★★★
    Conditions:
        CreateResource: !Equals [true, !Ref BoolValue] #BoolValue が true だったら CreateResources は true
    
    Resources:
        EC2Instance:
            Type: AWS::EC2::Instance
            Condition: CreateResource #Conditions の CreateResource が trueだったら EC2 インスタンスを作成
    ```

<br>
<br>

参考サイト

[初学者のためのCloudFormation超入門（テンプレート編)](初学者のためのCloudFormation超入門（テンプレート編)

[CloudFormationの条件（Conditions）の使い方](https://props-room.com/articles/handbook/aws-cloudformation-guide-322)

---

### Transform

- テンプレートファイルからリソースを作成する前に、そのテンプレートファイルに対する処理をするマクロの定義をするセクション

    - 例: テンプレートファイル内のテキストの置換や検索など

<br>

- Transform セクションでは定義された順番にマクロ処理を行う

<br>

- ★★Fn::Transform　組み込み関数からでもマクロは呼び出すことができる

<br>

- 呼び出すマクロの種類によって記述が少し異なるっぽい(多分)

    - `AWS::Serverless 変換` マクロ処理を行う場合

    ```yaml
    Transform: "AWS::Serverless-2016-10-31"
    ```

    - `AWS::Serverless 変換` とは AWS SAM で記載されたテンプレートを JSON または YAML 形式に変換するマクロ処理のこと
    
        - AWS SAM とは CloudFormation テンプレートの特定の記述形式のこと

    <br>
    <br>

    - `AWS::Include 変換` マクロ処理を行う場合

    ```yaml
    Transform: 
      Name: 'AWS::Include' #マクロ処理名
      Parameters: #引数
        Location: 's3://amzn-s3-demo-bucket/MyFileName.yaml'
    ```

    <br>

    - `AWS::Include 変換` とは当テンプレートに他のテンプレートの内容を埋め込む (= Include) することができるマクロ処理

<br>
<br>

参考サイト

[CloudFormation テンプレートの Transform セクション](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/transform-section-structure.html)


[[AWS Black Belt Online Seminar] AWS CloudFormation](https://d1.awsstatic.com/webinars/jp/pdf/services/20200826_AWS-BlackBelt_AWS-CloudFormation.pdf)

---

### Resources

- 作成するリソースの定義を行う要素

    ```yaml
    #定義
    Resources:
        [リソース名]:
            Type: [AWS::サービス名::リソースタイプ]
            Properties:
                [プロパティ名]: [プロパティ値]

    #具体例
    Resources:
        SampleEC2Instance:
            Type: AWS::EC2::Instance
            Properties:
                ImageId: [OSイメージID]
                SecurityGroupIds: [セキュリティグループID]
                KeyName: [利用するキーペア名]
    ```

<br>
<br>

参考サイト

[初学者のためのCloudFormation超入門（テンプレート編)](https://www.isoroot.jp/blog/6760/)

---

### Outputs

- テンプレートからスタックを作成した後、そのスタックに関する特定の情報を提供するための要素

    - Outputs 要素で定義した項目を他のスタックから参照することができる (= クロススタック参照)

    - CloudFormation のコンソール画面で表示させたい項目を Outputs 要素で定義することができる

    - スタック作成や更新の API 呼び出しに対する応答として、Outputs 要素で定義した値を返すことができる

    <br>

    ```yaml
    #定義
    Outputs:
        [アウトプット論理名]:
            Description: [説明]
            Value: [出力したい値]
            Export:
                Name: [クロススタック参照にエクスポートされるリソース出力の名前]

    #具体例
    Resources:
        MySampleBucket:
            Type: "AWS::S3::Bucket"

    Outputs:
        BucketName:
            Description: "The name of the S3 bucket"
            Value: !Ref MySampleBucket #MySampleBucket のバケット名を出力
    ```

<br>
<br>

参考サイト

[初学者のためのCloudFormation超入門（テンプレート編)](https://www.isoroot.jp/blog/6760/)

[AWS CloudFormationのOutputの書き方](https://qiita.com/jonhyoku_imu/items/c4125c21143eb77d5612)

---

### Parameters と Mappings の違い

- Parameters は変数の型定義のイメージ

<br>

- Mappings は実際の値とそのキー名を定義するイメージ

    - Condition 要素や組み込み関数の Fn::FindInMap などと組み合わせることで、1つのテンプレートファイルから異なる環境に応じて適切なリソース作成ができるよう手助けするのか Mappings 要素の機能のイメージ

<br>
<br>

参考サイト

[CloudFormationのパラメータとマッピングの使い方](https://props-room.com/articles/handbook/aws-cloudformation-guide-321)

[CloudFormation入門](https://dev.classmethod.jp/articles/cloudformation-firstcontact/)