### 組み込み関数とは

- CloudFormation 側から提供されている関数

<br>

- 組み込み関数を利用することでリソースの情報を取得したり、条件を設定したり、情報を加工することができる

<br>

- 基本的には `Fn::関数名: 引数` で提供されている

    - [Ref](#ref) 関数だけは例外

    - **YAML で利用する場合のみ** `!関数名 引数` という短縮形でも呼び出すことができる (関数名と引数の間に:を記入しないように注意)

<br>
<br>

参考サイト

[組み込み関数リファレンス](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html)

---

### Ref

- 指定したパラメータまたはリソースの値を参照するための関数

    ```yaml
    #定義1
    Ref: パラメータ名やリソース名

    #定義2
    !Ref パラメータ名やリソース名 #:がないことに注意

    ########################

    #利用例
    Resources:
        EC2Instance:
            Type: AWS::EC2::Instance
            #Propertiesは省略

    Outputs:
        EC2Id:
            Description: 作成するEC2のリソースIDを出力する
            Value: !Ref EC2Instance #★Refでリソース名を参照
            Export:
                Name: EC2 Resource ID
    ```

<br>
<br>

参考サイト

[Ref](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html)

[【AWS】CloudFormationでよく使われる関数をわかりやすく解説する](https://qiita.com/hiyanger/items/e931b2e267e91e97084e)

[【AWS初学者向け・図解】CloudFormationの組み込み関数を現役エンジニアがわかりやすく解説①](https://o2mamiblog.com/aws-cloudformation-intrinsic-function-beginner-1/#toc2)

---

### Fn::FindInMap

- Mapping 要素で定義された値を取得する関数

    ```yaml
    #定義1
    Fn::FindInMap: [ MapName, TopLevelKey, SecondLevelKey ]

    #定義2
    !FindInMap [ MapName, TopLevelKey, SecondLevelKey ]

    ########################

    #利用例
    Mappings:
        RegionMap: 
            us-east-1: #TopLevelKey
                ami: "ami-0ff8a91507f77f867" #SecondLevelKeyとValue
            us-west-1: 
                ami: "ami-0bdb828fd58c52235"

    Resource:
        EC2Instance:
            Type: AWS::EC2::Instance
            Properties:
                ImageId: !FindInMap [RegionMap, us-west-1, ami] #RegionMapのキー:us-west1にあるキー(ラベル):amiに紐づいている値を取得
    ```

<br>
<br>

参考サイト

[Fn::FindInMap](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-findinmap.html)

---

### Fn::Sub

- 引数の文字列中の変数を特定の値に置き換える関数

    ```yaml
    #定義1
    Fn::Sub:
        - StringParam #元となる文字列
        - Var1Name: Var1Value #StringParam中にある変数名とその値
          Var2Name: Var2Value

    #定義2
    !Sub
        - StringParam
        - Var1Name: Var1Value
          Var2Name: Var2Value

    #定義3
    Fn::Sub: StringParam(変数名含む)
    !Sub StringParam(変数名含む)
    ```

    ```yaml
    #利用例1
    Resources:
        MyBucket:
            Type: AWS::S3::Bucket
            Properties:
                BucketName: !Sub #第一引数のDomain部分を第二引数で指定した値に置き換える
                    - "www.${Domain}"
                    - Domain: "myBucket"

    #利用例2
    Resources:
        MyBucket:
            Type: AWS::S3::Bucket
            Properties:
            BucketName: !Sub "myBucket-${AWS::Region}" #★AWS::Regionを現在のリージョンに置き換える
    ```

<br>
<br>

参考サイト

[CloudFormation の組み込み関数 Fn::Sub のちょっとイイ使い方](https://blog.css-net.co.jp/entry/2022/04/20/105925)

[Cloudformationのテンプレートに使える関数をまとめてみました ( 2 )](https://dev.classmethod.jp/articles/lim-cloudformation-function-2/#toc-5-fnsub)

---

### Fn::GetAtt

- リソースの特定の属性値を取得する関数

    ```yaml
    #定義1
    Fn::GetAtt: [ logicalNameOfResource, attributeName ]

    #定義2
    !GetAtt logicalNameOfResource.attributeName

    ########################

    #利用例
    Resources:
        MyEC2Instance:
            Type: AWS::EC2::Instance
            #Propertiesは省略

    Outputs:
        EC2InstanceType:
            Description: InstanceType of EC2
            Value: !GetAtt MyEC2Instance.InstanceType #★作成するEC2のインスタンスタイプをGetAtt関数で取得
            Export:
                Name: InstanceType
    ```

---

### 条件関数

- プログラミング言語の条件 if, and, or, not と同じ

- 詳しくは[こちら](#https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html)を参照

<br>
<br>

参考サイト

[条件関数](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html)