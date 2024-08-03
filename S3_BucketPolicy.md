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
            "Resource": "arn:aws:s3:::${ここにバケットの名前を入れる}",
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
            "sid": "1"
            // 特定のユーザーが特定のS3バケットにアップロードするアクションの許可
        },
        {
            "sid": "2"
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
        "Statement": {
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
                "arn:aws:s3:::{bucket-name}", 
                //特定のバケット内のオブジェクトを指定したりできる
                "arn:${Partition}:s3:::${bucket-name}/${object-name}"
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

---

### "Resource" を正しく理解する

<br>
<br>

参考サイト
[S3のポリシーに定義した「Resource」を正しく理解できていますか？](https://dev.classmethod.jp/articles/how-to-write-resource-of-s3-bucket-policy-and-iam-policy/)

---

### バケットポリシーと IAM ポリシー