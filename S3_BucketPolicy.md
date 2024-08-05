### バケットポリシーとは

ポイント
- バケットにアタッチするアクセスコントロール設定
- バケットポリシーはポリシードキュメントという JSON 形式で記述する (IAMポリシーの JSON 版と同じ記法)

---

### S3のバケットポリシー

1. AWS コンソールから S3 ダッシュボード画面に遷移

2. サイドメニューの「バケット」から、バケットポリシーを確認/編集したいバケットを選択

3. 「アクセス許可」タブを選択し、「バケットポリシー」の「編集」をクリック

<img src="./img/S3-Bucket-Policy_1.png" />

<br>

4. 直接 JSON を記述するか、右側の「ステートメントを編集」を使って、バケットポリシーを編集可能。編集が終わったら、「変更の保存」をクリック

<img src="./img/S3-Bucket-Policy_2.png" />
<img src="./img/S3-Bucket-Policy_3.png" />

--- 

### バケットポリシーの見方

```JSON
{
    "Version": "2012-10-17",
    "Statement":　{
            "Sid": "Stmt1621068192000",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::bucket-name",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "xxx.xxx.xxx.xxx",
                },
            }
        }
}
```

<br>

各項目とその説明

- Version: ドキュメントポリシーの文法のバージョン
- Statement: 権限の設定単位
    - Sid: ステートメントID (**文字列のため "firstStm"とかでもいい**)

    - Effect: Allow(許可)かDeny(拒否)

    - Principal: 誰に対するアクセス設定なのか (下のアクションの実行者)

    - Action: 当Statementで制御(Allow/Deny)するアクション
        - アカウント、ロール、IAMグループ、AWSサービスなどを指定できる
        - サービス名.* でそのサービスの全ての操作を指定できる

    - Resource: Allow/Denyする対象の操作(バケットのARNなど)
        - サービス名.* でそのサービスの全ての操作をAllow/Denyできる

    - Condition: Allow/Denyの条件
        - IPアドレスの制限
        - ユーザー名による制限

            など様々な条件を設定することができる

<br>

ステートメントは複数設定可能
- Statementに\[\](配列)の形で指定し、中に\{\}で個別のStatementを記述する

```JSON
{
    "Version": "2012-10-17",
    // Statementに[]を設定する
    "Statement": [
        // 内部にて、{}で個別のStatementを記述する
        {
            "Sid": "1"
            // 特定のユーザーが特定のS3バケットにアップロードするアクションの許可
        },
        {
            "Sid": "2"
            // 特定のユーザーが特定のS3バケットからデータを取得するアクションの許可
        }
    ]
}
```

<br>

Principal や Action, Resource, Condition などにも複数の値を設定可能

*Statementと同様に\[\]の配列の形で設定する (**Conditionはちょっと異なる**)

```JSON
{
    "Statement": {
        "Sid": "xxx",
        "Effect": "Allow",
        "Principal": {
            "AWS": [
                "xxxxxxxxxxxx", // 特定のユーザーを指定したり(アカウントIDやARN)、
                "arn:aws:iam::xxxxxxxxxxxx:group/{group-name}", // 特定のIAMグループも指定できる
            ],
        },
        "Action": [
            "s3:GetObject", // S3のデータを取得する操作
            "s3:PutObject" // S3にデータを保存する操作
        ],
        "Resource": [
            // AWSのインスタンスのARNで特定のバケットを指定したり、
            "arn:aws:s3:::bucket-name", 
            //特定のバケット内のオブジェクトを指定したりできる
            "arn:${Partition}:s3:::bucket-name/object-name"
        ],
        "Condition": {
            // Conditionは複数の条件があっても{}でくくる
            // なお複数条件を設定した場合、全ての条件をクリアしないとアクションの許可はされない(今回の場合はAllowのStatementだから)

            //1つ目の条件(IPアドレス制限)
            "IpAddress": {
                // 特定の項目には[]で括って複数値を設定する
                "aws:SourceIp": [
                    // もしアクションを実行するprincipalのIPがxxx.xxx.xxx.xxxだったら、許可する
                    "xxx.xxx.xxx.xxx",
                    // または、以下のIPアドレスに属するIPだったら許可
                    "192.228.xx.xx/32"
                ],
            },
            // 2つ目の条件(ユーザー名制限)
            "StringEquals": {
                // ユーザー名が以下の通りだったら、アクションを許可
                "aws:username": "yyyyy" 
            },
        },
    },
}
```

<br>
<br>

参考サイト

ポリシードキュメントの基本について
- [S3のバケットポリシー書き方まとめ](https://qiita.com/irico/items/a3ab1f8ebf1ece9cc783)
- [JSONポリシーについて簡単にまとめ](https://www.capybara-engineer.com/entry/2019/12/07/212926)

Principalについて
- [AWS JSON ポリシーの要素: Principal](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_elements_principal.html)

---

### "Principal": "*" の意味

- パブリックアクセスを意味する = (AWSアカウントの有無に関係なく)誰でも

- 次の書き方は同じパブリックアクセスを意味する
```JSON
"Principal": "*"
```

```JSON
"Principal": {
    "AWS": "*"
}
```

<br>
<br>

参考サイト

[S3バケットのバケットポリシーで「Principal: "*"」とすることの意味について](https://qiita.com/st10/items/d5a4737d6e5ede77ea3f)

[AWS JSON ポリシーの要素: Principal](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_elements_principal.html#principal-anonymous)

---

### "Resource" を正しく理解する

バケットポリシーの Action によって、操作対象の Resourec の種類が決まっている

- Action 対象の Resource が正しく設定されていない場合、実行がエラーになる

<br>

例: "Action": "s3:GetObject"

```JSON
{
    "Version": "~~",
    "Statement": {
        "Action": {
            "s3:GetObject"
        },
        "Resource": {
            "arn:aws:s3:::bucket-name"
        },
    }
}
```

上記バケットポリシーについて
- Resource は"bucket-name"という$\color{red}バケット$
- Action の s3.GetObject の対象はバケットではなく$\color{red}オブジェクト$

→ よって、上記のバケットポリシーは誤り

<br>

"Action": "s3:GetObject"の正しい設定

```JSON
{
    "Version": "~~",
    "Statement": {
        "Action": {
            "s3:GetObject"
        },
        "Resource": {
            "arn:aws:s3:::bucket-name/*"
        },
    }
}
```

上記バケットポリシーについて
- Resource は"bucket-name"というバケットの全ての$\color{red}オブジェクト$
- Action の s3.GetObject の対象は$\color{red}オブジェクト$

→ よって、上記バケットポリシーの Action の対象と esource の種類は正しく設定されている

<br>

複数の Action とそれぞれの Action に対応する Resource をまとめて1つの Statement に記述することもできる

- Action について
    - s3:ListBucket の対象は**バケット**
    - s3.GetObject の対象は**オブジェクト**

- Resource について
    - "bucket-name"という**バケット**
    - "bucket-name"というバケット内の全ての**オブジェクト**

```JSON
{
    "Version": "~~",
    "Statement": {
        "Action": [
            "s3:ListBucket"
            "s3.GetObject",
        ],
        "Resource": [
            "arn:aws:s3:::bucket-name",
            "arn:aws:s3:::bucket-name/*"
        ]
    }
}
```

<br>
<br>

参考サイト

Action と Resource の関係について
- [S3のポリシーに定義した「Resource」を正しく理解できていますか？](https://dev.classmethod.jp/articles/how-to-write-resource-of-s3-bucket-policy-and-iam-policy/)

各アクションの対象一覧
- [Amazon S3 のアクション、リソース、条件キー](https://docs.aws.amazon.com/ja_jp/service-authorization/latest/reference/list_amazons3.html#amazons3-actions-as-permissions)

---

### バケットポリシーと IAM ポリシー



---

### オブジェクトの所有者とアクセス

- デフォルトでは、オブジェクトにはそのオブジェクト所有者のみがアクセス可能
    - たとえ、バケットの所有者であろうと他の人が所有者となっているオブジェクトにはアクセスできない

- ACL を無効にするとオブジェクトの所有者は、バケットの所有者になる
    - たとえ他のユーザーからアップロードされたオブジェクトでも、所有者はバケットの所有者になる

<br>
<br>

参考サイト

[SAA学習-S3-オブジェクト所有者の変更](https://in-housese.hatenablog.com/entry/2021/05/10/082954)

---

### ブロックパブリックアクセスとは

S3バケットが誤ってパブリックに公開されるのを防ぐ仕組み
- ブロックパブリックアクセスを有効化しておくと、バケットポリシーで "principal": "*" の設定ができなくなる

    -> パブリックに公開されるのを防ぐ
    
<br>

ブロックパブリックアクセスには2つのレベルがある
- アカウントレベルのブロックパブリックアクセス 
    - その AWS アカウントに存在するすべての S3 バケットに対してのブロックパブリックアクセス設定

    - AWS コンソールの S3 ダッシュボードにて、「このアカウントのブロックパブリックアクセス設定」をクリック

    <img src="./img/S3-Block-Public-Access_2.png" />

    <br>

- バケットレベルのブロックパブリックアクセス
    - 1 つの S3 バケット単体に対してブロックパブリックアクセス設定

    - AWS コンソールの S3 ダッシュボードにて、任意のバケットを選択し、「アクセス許可」タブをクリック

    <img src="./img/S3-Block-Public-Access_1.png" />

<br>

実際にブロックパブリックアクセスはどのように機能するのか?
- 例: バケットレベルのブロックパブリックアクセスを有効化、そのバケットのバケットポリシーを変更し、オブジェクトをパブリックに公開しようとすると

<img src="./img/S3-Block-Public-Access_3.png" />

結果: バケットポリシーがブロックパブリックアクセスに競合し、エラーとなる

<br>

ブロックパブリックアクセスの各項目について

- アカウントレベルもバケットレベルもブロックパブリックアクセスの項目は同じ

<img src="./img/S3-Block-Public-Access_1.png" />

- 新しいアクセスコントロールリスト (ACL) を介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする
    - 新規に作成する ACL でパブリックに公開する設定をできなくする

<br>

- 任意のアクセスコントロールリスト (ACL) を介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする
    - 既存 ACL にて、パブリックに公開する設定を削除する

<br>

- 新しいパブリックバケットポリシーまたはアクセスポイントポリシーを介して付与されたバケットとオブジェクトへのパブリックアクセスをブロックする
    - 新規に作成するバケットポリシーでパブリックに公開する設定をできなくする

<br>

- 任意のパブリックバケットポリシーまたはアクセスポイントポリシーを介したバケットとオブジェクトへのパブリックアクセスとクロスアカウントアクセスをブロックする
    - 既存のバケットポリシーでパブリックに公開する設定をできなくする。かつ[クロスアカウントアクセス](#クロスアカウントアクセスとは)の設定もできなくする

<br>

2つのブロックパブリックアクセスの競合について

以下の競合ケースを考える

1. アカウントレベルのブロックパブリックアクセスは ON で、バケットレベルのブロックパブリックアクセスは OFF
    - 無理らしい。バケットレベルのブロックパブリックアクセスを OFF にしてバケットをパブリックに公開しようとしても、アカウントレベルのブロックパブリックアクセスが ON ならばバケットの公開はできない

    - 上記の理由: アカウントレベルのブロックパブリックアクセスの方が強いから

<br>

2. アカウントレベルのブロックパブリックアクセスは OFF で、バケットレベルのブロックパブリックアクセスは ON
    - 十分にあり得る。ユースケースとしては、個別にパブリックに公開したいバケットと、プライベートにしておきたいバケットがある場合など

<br>

ブロックパブリックアクセスに関するよくある勘違い

以下は誤り
- ブロックパブリックアクセスを OFF にするとパブリックに公開されてしまう

正しくは、
- ブロックパブリックアクセスを OFF にすると、パブリックに公開する**設定が可能になる**

→ ブロックパブリックアクセスを OFF にしても、バケットポリシー や ACL でアクセスの許可を設定しなければ、誰もアクセスできない

<br>
<br>

参考サイト

ブロックパブリックアクセスについて
- [s3のブロックパブリックアクセス とは](https://qiita.com/miyuki_samitani/items/61c736f300424b9be3fa)

- [[小ネタ] AWS アカウントレベルの S3 ブロックパブリックアクセスが設定されていて S3 のオブジェクトを公開するのに少し手間取った](https://dev.classmethod.jp/articles/i-had-a-bit-of-trouble-publishing-s3-objects-because-of-the-aws-account-level-s3-block-public-access-set-up/)

ブロックパブリックアクセスの各項目について
- [S3で誤ったデータの公開を防ぐパブリックアクセス設定機能が追加されました](https://dev.classmethod.jp/articles/s3-block-public-access/)

どちらのブロックパブリックアクセスが強いのか
- [アカウントレベルのブロックパブリックアクセスを有効化した場合、バケット毎にブロックパブリックアクセスを無効化することはできるのか教えてください](https://dev.classmethod.jp/articles/tsnote-account-block-public-access-01/)

---

### クロスアカウントアクセスとは