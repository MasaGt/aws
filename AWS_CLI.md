### AWS CLI とは

- PC にインストールし、インターネット経由で AWS への操作を行うことができるコマンドラインツール

    - 実態は、AWS CLI にて入力したコマンドは、https リクエストに変換され、操作対象のエンドポイントに送信される

    <br>

    <img src="./img/AWS-CLI_1.svg" />

    引用: [AWS 初心者必見! AWS の認証と認可を理解し、AWS アカウントをMFA で保護しよう Part1](https://blog.nijot.com/aws/protecting-your-aws-account-with-mfa-part1/)

<br>
<br>

参考サイト

[AWS の API を理解しよう !](https://aws.amazon.com/jp/builders-flash/202210/way-to-operate-api-2/)

---

### AWS CLI を利用するために

#### 前提条件

- AWS CLI を利用するには、CLI で操作したい対象への権限が設定されたユーザーの**アクセスキーとシークレットアクセスキー**の情報が必要になる

- AWS CLI をローカルにインスール

    - 詳しくは[こちら](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)

<br>
<br>

#### AWS CLI で利用する認証情報の設定

- `aws configure` コマンドを入力し、対話形式で認証情報 (アクセスキー & シークレットアクセスキー) や 操作対象のリージョン、コマンドが返す情報の出力形式を決める

    - ★configure コマンドの入力結果は `.aws` ディレクトリ配下の `config` と `credentials` というファイルに記録される

    - ★★`configure` コマンドを実行しなくとも、 `.aws/config` と `.aws/credentials` を作ってしまえば同じこと

<br>
<br>

- `.aws/config`

    - 操作対象のリージョンや、CLI の出力形式、その他スイッチロールのための ARN などの情報を保持するファイル

    - 基本的に、アクセスキー & シークレットアクセスキー以外の情報を保存するファイル

    - \[プロファイル名\] の後に `region` (=region) や `output` (=CLI の出力形式) などを定義する

    <br>

    ```plaintext
    configの中身の例

    [default]
    region=eu-south-1
    output=json
    ```

<br>
<br>

- `.aws/credentials`

    - 認証情報 (アクセスキー & シークレットアクセスキー) が保存されるファイル

    - \[プロファイル名\] の後に `aws_access_key_id` (=アクセスキー) と `aws_secret_access_key` (=シークレットアクセスキー) が定義される

    <br>

    ```plaintext
    credentialsの中身の例

    [default]
    aws_access_key_id=アクセスキー
    aws_secret_access_key=シークレットアクセスキー
    ```

<br>
<br>

参考サイト

Youtube: [くろかわこうへいのAWS CLI講座#2【コマンド概要 / プロファイルの使い分け / クエリとJMESPass】](https://youtu.be/-pv_BAFKWvU?si=3PejVZ9xJH2SYyC-)

[AWS CLI のコンフィグファイルと環境変数とコマンドラインオプションで指定できる内容をまとめて確認してみた](https://dev.classmethod.jp/articles/aws-cli-configuration-file-env-option/)

---

### AWS CLI の基本

- 基本的なコマンドの構成は以下の通り

    - command: AWS サービス

    - subcommand: AWS サービスに対して行いたい操作

    <img src="./img/AWS-CLI_2.png" />

    引用: [AWS Black Belt Tech シリーズ 2015 AWS CLI & AWS Tools for Windows Powershell](https://www.slideshare.net/slideshow/aws-black-belt-tech-2015-aws-cloudtrail-aws-sdk-for-powershell/50794384)

<br>
<br>

#### 困った時の help コマンド

- help コマンドでどのようなコマンド、サブコマンド、オプションが利用可能かを調べることができる

    - `aws help` でどのようなサービスを利用できるかを調べることができる

    - `aws ec2 help` で EC2 に対して大なうことができる操作を調べることができる

<br>
<br>

参考サイト

Youtube: [くろかわこうへいのAWS CLI講座#2【コマンド概要 / プロファイルの使い分け / クエリとJMESPass】](https://youtu.be/-pv_BAFKWvU?si=3PejVZ9xJH2SYyC-)

[AWS Black Belt Tech シリーズ 2015 AWS CLI & AWS Tools for Windows Powershell](https://www.slideshare.net/slideshow/aws-black-belt-tech-2015-aws-cloudtrail-aws-sdk-for-powershell/50794384)

---

### プロファイル

- CLI で利用する認証情報、操作対象リージョン、出力形式の設定内容の集まりを**プロファイル**と呼ぶ

    - `aws configure` で設定した内容は CLI ではデフォルトプロファイルとして利用される

    - ★他プロファイルを追加 & そのプロファイルに名前を付け、かつ CLI で利用することも可能

    <br>

    <img src="./img/AWS-CLI-Profile_1.svg">

<br>
<br>

#### 名前付きプロファイルの作成方法

以下の方法がある

1. `aws configure --profile [プロファイル名]` で対話形式で名前付きプロファイルを設定する方法

<br>

2. `.aws/config` と `.aws/credentials` を直接編集し、プロファイルに紐づく設定内容を追加する方法

<br>
<br>

#### CLI で名前付きプロファイルを利用する方法

- ★コマンドに `--profile [プロファイル名]` でそのコマンドで使用したいプロファイルを指定すればよい

    ```bash
    # S3 にて my-sample-bucket というバケットを作成したい
    # ★上記操作に利用するプロファイルとして profileA を指定する★

    aws s3 mb s3://my-sample-bucket --profile profileA
    ```

<br>
<br>

参考サイト

[AWS CLI のコンフィグファイルと環境変数とコマンドラインオプションで指定できる内容をまとめて確認してみた](https://dev.classmethod.jp/articles/aws-cli-configuration-file-env-option/)

---

### CLI のベストプラクティス

- デフォルトプロファイルは利用しない & 利用できないようにする

    - 理由: CLI での操作の際に `--profile` オプションでプロファイルを指定して操作したい = 操作の際に使うプロファイルを明確にしておきたい

    - デフォルトプロファイルを利用できないようにするには、 `.aws/config` と `.aws/credentials` から \[default\] を含めた認証情報やリージョン、出力形式の設定内容を削除すればいい

<br>
<br>

参考サイト

Youtube: [くろかわこうへいのAWS CLI講座#2【コマンド概要 / プロファイルの使い分け / クエリとJMESPass】](https://youtu.be/-pv_BAFKWvU?si=n71_c3Lfjq4n86Ow&t=462)

---

### AWS CLI の裏側 ~ sigv4

#### sigv4 とは

- API リクエストに署名を付与するためのプロトコル (仕組み、プロセス)

- コマンドや認証情報などからリクエストに付与する署名を作成する = sigv4

    - sigv4 は最終的には文字列を生成する

        - ★生成される文字列は sigv4 でしか利用できない = 他のバージョンの sig や他の認証サービスでは何の意味もなさない文字列

<br>

- ★CLI への入力から HTTP(S) リクエストを生成 & 発信するのは sigv4 の役割ではない

<br>

#### sigv4 の中身 (署名はどのようにして生成されるのか)

<img src="./img/Sigv4_1.png" />

引用: [AWS Version 4 Signing Process, Complete Implementation Java](https://www.javaquery.com/2016/01/aws-version-4-signing-process-complete.html)

<br>

- 超ざっくり説明すると、

    1. コマンドの内容からリクエストが生成され、そのリクエストを元に、とある文字列を生成する = CanonicalRequest

        <img src="./img/Sigv4_2.svg" />

    <br>

    2. sigv4 の認証パラメーター (「署名プロセスの一部として使用するアルゴリズム」や「1で生成したCanonicalRequest」など) から、とある文字列を生成する = StringToSign

        <img src="./img/Sigv4_3.svg" />

    <br>

     3. シークレットアクセスキー、日付、リージョンなどから新たに署名キーを作成する (これもとある文字列) = kSigning

        <img src="./img/Sigv4_4.svg" />

    <br>

     4. 2で生成した StringToSign と 3で生成した kSigning からリクエストに付与する署名を生成する (これもとある文字列)

        <img src="./img/Sigv4_5.svg" />

<br>

- 生成した署名は、以下のどちらかの方法でリクエストに付与される

    1. リクエストの Authorization ヘッダーの Signature に署名を付与する

        - Authorization ヘッダーはそのほかに、「署名のアルゴリズム」 や 「アクセスキー+タイムスタンプ+リージョン+サービス名+"aws4_request" をスラッシュ (/) で繋げた文字列」 を含む

        - Authorization ヘッダー = 認証パラメーター

    <br>

    2. クエリ文字列の一部に署名を付与する

        - リクエスト URL のクエリ部分に署名を含める方法

        - 署名以外にも「署名のアルゴリズム」などの認証パラメーター情報もクエリ部分に含まれる必要がある

            ```
            以下はクエリ文字列に署名を含む リクエスト URL の例
            ★最後のX-Amz-Signature部分に生成された署名が付与される

            https://ec2.amazonaws.com/?Action=DescribeInstances&Version=2016-11-15&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE/20220830/us-east-1/ec2/aws4_request&X-Amz-Date=20220830T123600Z&X-Amz-SignedHeaders=host;x-amz-date&X-Amz-Signature=署名文字列
            ```
    
<br>
<br>

#### sigv4 の特徴

- ★秘密鍵 (シークレットアクセスキー) や他のパラメーターから、別の鍵を生成する (中間秘密鍵)

    - シークレットアクセスキーの情報は直接は含まれない

<br>

- リージョンや、サービス、日付なども署名プロセスで利用されるため、スコープがめちゃ限定される = ハッキングされても、すぐ改竄されたとわかる

    - 例: S3 へのバケット作成リクエストが、 EC2 への操作に改竄されていたとしたらすぐに改竄されたリクエストだとわかる

<br>

- 日付もパラメーターとして利用するため、特定の日しか生成されたキーは利用できない (https://youtu.be/BpTpcUA_F2w?si=YyXHJXIfMWExOF2K&t=1524)

<br>
<br>

参考サイト

[AWS の API を理解しよう ! 中級編 ~ リクエストの署名や CLI/SDK の中身を覗いてみる](https://aws.amazon.com/jp/builders-flash/202210/way-to-operate-api-2/)

[AWS Version 4 Signing Process, Complete Implementation Java](https://www.javaquery.com/2016/01/aws-version-4-signing-process-complete.html)

Yotube: [0x1 - How AWS SIGv4 and SIGv4A work](https://youtu.be/BpTpcUA_F2w?si=HPs90C3HMtD1mqjN)

[AWS API リクエスト署名の要素](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_sigv-signing-elements.html#authentication)

[署名付き AWS API リクエストを作成する](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_sigv-create-signed-request.html#add-signature-to-request)