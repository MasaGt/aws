### Lambda とは

- ★ リージョンサービス

- サーバレスのFaaS(Function as a Service) サービス

    - FaaS: FaaSとは「Function as a Service」の略で、サーバレスでアプリケーション開発ができるクラウドサービスのこと

        - 開発者側でのサーバー管理 (必要な環境の構築) が不要になる

- わかりやすくいうと、プログラムコードとそれに関連する依存関係やライブラリを AWS Lambda にアップロードするだけでプラグラムを実行できるサービス

<br>

<img src="./img/Lambda_1.webp" />

引用: [AWS Lambdaってなに？なにができるの？](https://www.stylez.co.jp/aws_columns/cloud-native_development_on_aws_and_serverless/what_is_aws_lambda/)

<img src="./img/Lambda_2.png" />

引用: [「Lambda」ってなにがスゴイんですか？](https://biz.nuro.jp/column/aws-mama-014/)

<br>

- EC2 にプログラムの実行環境とプログラムコードをおけば同じことが実現できるが、必要なソフトウェアやアプリケーションに必要なライブラリなどの用意はこちらがしなければならない

<img src="./img/Lambda_3.png" />

引用: [サーバーレスとは？](https://blog.serverworks.co.jp/2022/08/05/131624)

<br>

#### 利用例

- API Gateway と 組み合わせることで、API の実行処理部分を Lambda で行う

- Event Bridge と組み合わせることで、定期的なバッチ処理の実行部分を Lambda で行う

などなど

<br>
<br>

参考サイト

[AWS Lambdaってなに？なにができるの？](https://www.stylez.co.jp/aws_columns/cloud-native_development_on_aws_and_serverless/what_is_aws_lambda/)

[「Lambda」ってなにがスゴイんですか？](https://biz.nuro.jp/column/aws-mama-014/)

---

### Lambda の重要なコンセプト

<br>

#### Lambda 関数

- Lambda にアップロードするプログラムコードのこと

<br>

#### ランタイム

- プログラムコードの実行に必要なライブラリやパッケージのこと

- デフォルトでは、 `Node.js`, `Java`, `Python`, `Ruby`, `.NET` が選択できる
    
    - ★上記以外の言語のプログラムコードを実行したい場合は、`カスタムランタイム`を選択し、そのプログラムコードの実行に必要なものは自分で用意するで実行可能になる

<br>

#### トリガー

- ★ Lambda 関数は EC2 のように常に起動しているのではなく、トリガーによって起動される

- トリガー = Lambda 関数を呼び出すきっかけ (主に AWS サービスでのイベント)

- トリガーによって起動された Lambda は event を受け取る
    - event は JSON 形式のオブジェクトで、Lambda 関数内で参照可能

<br>

#### バージョン

- Lambda はバージョン管理が可能
    - Lambda関数を更新すると新しいバージョンとして管理される
    - 過去のバージョンもの残るので、過去のバージョンを実行することも可能

<br>

#### エイリアス

- Lambda 関数の特定のバージョンにつける別名

    - 加重エイリアスを利用することで1つのエイリアスで2つのバージョンを参照することができる

        - 加重エイリアス: 1つのエイリアスへのアクセスを2つのバージョンに対して設定した割合で分散させることができる機能

- エイリアスはいつでも付け替え可能

<br>

#### レイヤー

- 複数の Lambda 関数 で共通するコードを zip に切り出して共有することができる機能

    - 同じライブラリを利用する Lambda 関数が複数ある場合、そのライブラリをレイヤーに切り離すことができる

- うまくレイヤーに切り離すことで、Lambda 関数自体のサイズを小さくすることができる

- ★ レイヤーもバージョン管理が可能

<br>

#### extensions

- 拡張機能
    - アプリケーションのモニタリングやログ収集機能を追加するツールやアプリケーションのこと

    - extensions を利用すればアプリケーションコードの変更なしに、上記のような機能を追加することができる

<br>

- Internal Extensions と
 External Extensions
    
    <img src="./img/Lambda-Extensions_1.png" />

    引用: [Power up your serverless application with AWS Lambda extensions](https://dev.to/slsbytheodo/power-up-your-serverless-application-with-aws-lambda-extensions-3a31)

    - **Internal Extensions**
        - 実行環境内においてプログラムコードと同じプロセスで実行される

        - Invoke フェーズ中に実行される
            - Lambda のライフサイクルに関しては[こちら](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-runtime-environment.html)を参照

    <br>

    - **External Extensions**
        - 実行環境内においてプログラムコード (Lambda関数) とは独立したプロセスとして実行される

        - プログラムコード前に動作を開始でき、プログラムコード終了後も動作を継続できる

<br>

- internal / external extensions を利用する場合は、利用したい exntension を[レイヤー](#レイヤー)に追加する必要がある

    - 1レイヤーに複数の extension を含めることができ、 1つの Lambda 関数に最大で 10 の extensions を設定することができる　

<br>

#### 同期呼び出し / 非同期呼び出し

- **同期呼び出し**
    - 呼び出し元が Lambda 関数の処理結果を待ち、レスポンスを受け取りとる

- **非同期呼び出し**
    - 呼び出し元はリクエストを送信後、Lambda 関数の処理結果を待たずに後続処理を実行する

    - 内部では、トリガーからのイベントを Event Queue というキューに入れ、　Lambda 関数はそのキューから非同期にイベントを読み込んで処理を実行する    

    <img src="./img/Lambda-Async-Invoke_1.png" />

    引用: [【初心者向け】AWS Lambdaの機能と役割について](https://asa3-cloud.com/aws-lambdaの機能と役割について/)


- ★ Lambda 関数の実行方式(同期・非同期)は、トリガーとなる AWS サービスによって異なる
    - 例: Amazon API Gateway がトリガーの場合は同期呼び出し、 Amazon S3 がトリガーの場合は非同期呼び出しとなる

<br>

#### コールドスタート / ウォームスタート

<img src="./img/Lambda-Cold-Warm-Start_1.png" />

引用: [サーバレス時代の必須技術、AWS Lambdaを知ろう](https://www.itis.nssol.nipponsteel.com/blog/aws-lambda-01.html)

<br>

- **コールドスタート**
    - Lambda 関数の実行前に実行環境の作成やランタイムの初期化、レイヤーにあるライブラリなどのダウンロードが実行される

    - 上記初期化処理の後に Lambda 関数が実行されるため、その分遅れる

- **ウォームスタート**
    - 実行環境が残っている期間内に再び同じ Lambda 関数を呼び出すと、その環境が再利用されることがある
        - 実行環境作成などの初期化処理がいらないためすぐに Lambda 関数の実行ができる = ウォームスタート

        - コールドスタートに比べると、初期化処理などの時間分早く処理が完了する

    - ★実行環境がどのぐらいの期間残るのかを設定することはできない

<br>

- ウォームスタートの注意点

    - Lambda 関数の同時実行数によっては、新たにコールドスタートされるものもある

        <img src="./img/Lambda-Cold-Warm-Start_2.png" />

    <br>

    - 実行環境が複数残っている場合、同じクライアントが再び同じ Lambda 関数を呼び出したとしても、前回と同じ実行環境が使用されるとは限らない

        - ★ Lambda 関数のコードはステートレスにする必要がある

        <img src="./img/Lambda-Cold-Warm-Start_3.png" />

<br>
<br>

参考サイト

同期/非同期呼び出しについて
- [Lambdaの同期・非同期処理の理解](https://zenn.dev/mi_01_24fu/books/d91d10985a5a1a/viewer/lambda_synchronous_asynchronous#前提%3A-lambdaに非同期処理は存在する？)
- [そのLambdaの実行…同期？非同期？](https://qiita.com/is_ryo/items/009220083e179272cbda)

extensions について
- [Lambda 関数のログをLambda Extensionsを利用してS3に出してみた](https://qiita.com/horit0123/items/c3e44ba4a54e7fc938d2#internal-extensions-external-extensions)
- [Lambda Extensionsは何が嬉しいのか](https://dev.classmethod.jp/articles/cons-of-lambda-extensions/)
- [AWS Lambda の Extension API を使いたいがために Go で Lambda Extension を自作してみた](https://michimani.net/post/aws-lambda-extension-written-in-go/)

コールド/ウォームスタートについて
- [AWS Lambda 関数の実行の仕組みを知ろう !](https://aws.amazon.com/jp/builders-flash/202308/learn-lambda-function-execution/)
- [サーバレス時代の必須技術、AWS Lambdaを知ろう](https://www.itis.nssol.nipponsteel.com/blog/aws-lambda-01.html)
- [Lambdaの実行環境について(コールドスタートとウォームスタート)](https://zenn.dev/yoshii0110/articles/0d50e872b64f59)
- [Operating Lambda: パフォーマンスの最適化 – Part 1](https://aws.amazon.com/jp/blogs/news/operating-lambda-performance-optimization-part-1/)

---

### 特徴、機能

#### 予約済み同時実行 (Reserved Concurrency)

- 対象の Lambda 関数の最大同時実行数をリージョンの最大同時実行数から確保できる機能

    <img src="./img/Lambda-Reserved-Concurrency_1.png" />

<br>

- この機能の利用には追加料金は発生しない

<br>

- ★ 予約済み同時実行数を超過する場合、予約されていない同時実行数が余っていてもスロットリングエラーが起きる

    <img src="./img/Lambda-Reserved-Concurrency_2.png" />

<br>

#### Provisioned Concurrency (プロビジョニングされた同時実行)

- Lambda 関数の実行環境を事前に作成し、その数を維持する機能

- ★ Reserved Concurrency のように対象関数の同時実行数の上限を設定する機能ではない

- Provisioned Concurrency で事前に作成された同時実行数を超える実行環境が必要になった場合は、コールドスタートが発生する

    <img src="./img/Lambda-Provisioned-Concurrency_1.gif" />

    引用: [AWS Lambda 関数の実行の仕組みを知ろう !](https://aws.amazon.com/jp/builders-flash/202308/learn-lambda-function-execution/)

    <br>

- Provisioned Concurrency の利用には追加料金がかかる

<br>

#### 関数URL

<img src="./img/Lambda-Function-URLs_1.jpg" />

引用: [AWS Lambda 関数URLを設定しアクセスする方法【基礎】](https://kacfg.com/aws-lambda-function-urls-basic/)

<br>

- API Gateway を利用せずに、Lambda 関数 を HTTP(S) 公開する機能

    = Lambda 関数用の専用 HTTP エンドポイントを提供する機能

- 関数 URL の設定を作成し直すと、異なる URL アドレスで Lambda 関数が公開される

- 関数 URL のメリット
    - 遅延の低減: API Gateway による遅延がなくなる

    - コストの削減: API Gateway の利用コストを削減できる

    - タイムアウト上限: API Gateway を利用するとタイムアウト上限が 29秒 なのに対し、関数 URL を利用するケースではタイムアウト上限は 15 分

- API Gateway のメリット
    - 独自ドメイン名で Lambda 関数を HTTP 公開することが可能

    - [WAF](./WAF.md) を利用できる

    - IAM 認証以外の認証方法を利用可能

<br>

#### コード署名

- Lambda にコードがアップロードされた際にそのコードに署名の検証を行う機能

- 署名が行われていないコードがアップロードされた時に警告だけで済ますか、アップロードを失敗にするかの設定可能

- コードの署名には AWS Signer というサービスを使う
    - AWS Signer での署名には利用料金が発生しない

- コード署名機能の利用には料金は発生しない

<br>

#### 制約

- 最大実行時間は15分
    - 15分を超えると強制終了となる

- 最大同時実行数はリージョン単位で 1000
    - ★ **そのリージョンの全ての Lmbda 関数合わせた**同時実行数上限が 1000

    - サービスクォータの引き上げを申請すれば同時実行数を増やすことができる

    - [予約された同時実行数](#予約済み同時実行-reserved-concurrency) に設定できる最大値は、`そのリージョンの最大同時実行数 - 100` まで

    - 最大同時実行数以上の呼び出しはスロットリング (サービスが制限されること) され、実行されない

- 割り当てることのできるメモリの最大サイズは　10,240 MB (≒ 10GB)

- 割り当てることのできるストレージの最大サイズは 10,240 MB (≒ 10GB)

<br>
<br>

参考サイト

予約済み同時実行について
- [Lambdaを助けるのに理由がいるかい？（スロットリングの話）](https://kakehashi-dev.hatenablog.com/entry/2022/12/19/110000)

関数 URL について
- [【AWS】LambdaをHTTP接続する2つの方法（①API Gateway + Lambda, ②Lambda Function URLs)](https://ramble.impl.co.jp/2507/)
- [API Gateway不要!? Lambda関数URLでのAPI構築について考える](https://it.kensan.net/lambdafunctionurl-api-gateway.html)
- [AWS Lambda Function URLsとAmazon API Gatewayの違い](https://serverless.co.jp/blog/j94zz_4-m/)

コード署名について
- [[アップデート]信頼できる検証済みコード以外はデプロイ禁止！！Lambdaでコード署名による検証が利用可能になりました](https://dev.classmethod.jp/articles/lambda-support-verify-code-sign/)
- [[アップデート]AWS LambdaでAWS Signerを利用してコードの署名ができるようになったので試してみた](https://dev.classmethod.jp/articles/code-signing-for-aws-lambda/)
- [AWS SignerとLambdaによるコード検証](https://qiita.com/uirole/items/0f468add6b36a8732b25)
- [AWS Signerでコード署名についてまとめてみた](https://speakerdeck.com/atsuw0/aws-signertekotoshu-ming-nituitematometemita)

制約について
- [AWS Lambdaのストレージ容量が最大10GBまで拡張可能になりました](https://dev.classmethod.jp/articles/aws-lambda-10gb-storage/)
- [[アップデート]Lambdaのメモリ上限が10G、vCPUの上限が6に拡張されました！！ #reinvent](https://dev.classmethod.jp/articles/lambda-memory-limit-inclease-to-10g/)

---

### コスト

- Lamda を作成しただけでは料金は発生しない

- 主に実行時間に対して料金が発生する
    - 実行時間 = 初期化フェーズ (実行環境の作成や初期化) から、シャットダウンフェーズまでの時間

    - その他にも、リクエスト数やストレージなどにも料金が発生する

- 利用するリージョンによって金額が異なる

<br>

#### GB-秒　という単位について

- Lambda 関数に割り当てたメモリの容量(1GBとの比率) と Lambda 関数の実行時間の積

    ```
    4GB (4096 MB) のメモリを割り当てた Lambda 関数の今月の実行時間は20,000秒だった

    Q: 上記のケースは何GB-秒となるか?

    A: 4096 / 1024 (メモリ) × 20,000 (実行時間) = 80,000 GB-秒
    ```

- Lambda の実行時間にかかる料金やストレージ使用料は GB-秒 という単位で計算されることが多い

<br>

#### 基本コスト

- **実行時間分の料金**

    - Lambda 関数に割り当てるメモリの大きさによって実行時間にかかる料金も変化する

        - メモリを増量すればするほど実行時間に応じた料金は高くなる

        - ★ 一方で大きいメモリを割り当てると処理時間が短くなる = 実行時間が短くなるので、料金が安くなることもある

            - →メモリの大きさと実行時間のバランスを見つけることがコスト削減に繋がる

    <br>

    - メモリの種類によって実行時間の料金が違ってくる

        - `arm64` or `x86_64` が選択可能

        - arm64 の方がパフォーマンスも高く料金も安いので基本的には arm64 を選んで問題ない

    <br>

    - 無料利用枠として、毎月40万GB-秒の実行時間分の料金は無料になる

        - = 1GB のメモリを割り当てた Lambda 関数を 40万秒 (約111時間) までは無料で利用できる

            - = 512 MB のメモリを割り当てた Lambda 関数を 80万秒 (約222時間) までは無料で利用できる

            - = 2GB のメモリを割り当てた Lambda 関数を20万秒 (約55時間) までは無料で利用できる

    <br>

    - 1ヶ月の総実行時間が長ければ長いほど、実行時間にかかる料金は段階的に安くなる

        <img src="./img/Lambda-Cost_1.png" />
<br>

- **リクエスト数に対する料金**

    - 100万リクエストあたり USD \~~ の料金形態

    - 無料利用枠として、毎月100万リクエストは無料になる

<br>

- **ストレージの料金**

    - Lambda 関数実行時にはデフォルトで 512 MB のストレージが割り当てられる

    - 512 MB 分のストレージは無料で利用可能
        - ★ 無料利用枠の扱いではないので、Provisioned Concurrency を利用した時でも適用される

    - ストレージに 512 MB 以上割り当てた場合は、512 MB を超えた分だけ課金対象となる

        - `リージョンごとのストレージGB-秒あたりのストレージ料金` × `実行時間(秒)` × `512 MB以上で超えたぶんのストレージ (MB)` ÷ `1024 (MB)`
        - - 実行時間は`GB-秒`ではなく`秒`であることに注意 ([練習問題の2問目で確認](#練習問題))

<br>

#### 追加機能のコスト

- **Provisioned Concurrency**

    - ★ Lambda の無料利用枠 (実行時間,リクエスト数,ストレージ) は Provisioned Cncurrency が有効になっている Lambda 関数には適用されない

    - ★ 通常の Lambda 関数は実行した時間にしか料金が発生しないが、 Provisioned Concurrency を利用すると実行時間に関係なく Provisioned Concurrency を有効化してから無効化するまでの時間にも料金が発生する

        <img src="./img/Lambda-Provisioned-Concurrency_2.png" />

    - Provisioned Concucrrency を有効にした Lambda 関数の実行時間に対して発生する料金は通常の Lambda 関数の実行時間に対して発生する料金と金額が異なる

        - Provisioned Concurrency を有効にした Lambda 関数の実行時間料金の方が安い

        - しかし、 Provisioned Concurrency を有効にした場合、Provisioned Concurrency の利用時間に対して料金も発生するので、Provisioned Concurrency の方が高くなるケースが多い

    - `実行時間(GB-秒)` × `1GB-秒あたりの実行時間料` ＋ `プロビジョニングする実行環境数` × `Provisioned Concurrencyを有効にしていた時間(GB-秒)` × `1GB-秒あたりの Provisioned Concurrency 利用料金`

        - その他に通常のLambda関数と同様にリクエスト数、ストレージの料金が発生する

<br>

- **関数 URLs**

    - レスポンスの返却方法で`レスポンスストリーム`を選択した場合のみ料金が発生する
        - レスポンスストリーミング料金 = `レスポンスサイズ(GB)` × `1GBあたりのレスポンスに発生する料金` × `実行数`

    - レスポンスのサイズが 6MB を超えた分が課金対象

    - 毎月 100GB 分のレスポンスストリーミング料金が無料枠で提供される

<br>

#### データ転送

<img src="./img/Lambda-Cost_2.png" />

<br>

#### 練習問題

1. x86_64 のメモリ

    ```
    今月の Lambda 関数 A に対するリクエスト数は 300 万件だった
    Lambda 関数 A の平均実行時間は 120 ミリ秒
    メモリは 1536 MB、ストレージはデフォルトの 512 MB を割り当てた
    リージョンは東京

    Q: 今月の Lambda 関数 A の利用料金はいくらか?

    A: 
    [実行時間に対する料金は、、、]
    - 3,000,000 (リクエスト数) × 120 (ミリ秒) × 1536 / 1024 (メモリ) = 360,000 (秒) × 1.5 (メモリの1GBに対する割合) = 540,000 (1GB-秒単位での実行時間)

    - 無料枠として、40万GB-秒分の実行時間料が無料になるので、540,000 - 400,000 = 140,000(GB-秒)

    - 140,000 (実行時間(GB-秒)) × 0.0000166667 (1GB-秒にかかる料金) = 2.333338 USD

    → 少数第三位で四捨五入するので、実行時間に対する料金は 2.33 USD

    -------------

    [リクエスト数に対する料金は、、、]
    - 3,000,000 / 1,000,000 (100万件に対してのリクエスト割合) × 0.20 (リクエスト100万件あたりの料金) = 0.60 USD

    - 無料枠として 100万件分のリクエスト料金が無料になるので

    → よって最終的に発生するリクエスト料金は 0.60 - 0.20 = 0.40 USD

    -------------

    [ストレージの利用料金は、、、]
    - 512 MB のストレージ分は無料で利用可能なため、料金は発生しない

    -------------

    [合計金額]
    2.33 (実行時間料) + 0.40 (リクエスト料) = 2.73 USD
    *その他に、データ転送料金がかかる場合もある
    ```

<br>

2. arm64 のメモリ

    ```
    今月の Lambda 関数 A に対するリクエスト数は 50 万件だった
    Lambda 関数 A の平均実行時間は 1秒
    メモリは 2048 MB、ストレージは 3072 MB を割り当てた
    リージョンは東京

    Q: 今月の Lambda 関数 A の利用料金はいくらか?

    A:
    [実行時間に対する料金は、、、]
    - 実行時間(GB-秒)を計算すると、
        → 500,000 (リクエスト数) × 1 (秒) × { 2048 / 1024 (メモリ) } = 1,000,000 (GB-秒)

    - 無料枠として40万GB-秒分の実行時間料は無料になるので、1,000,000 - 400,000 = 600,000 (GB-秒)
        → よって、60万GB-秒ぶんの実行時間に対してのみ料金が発生する

    - 実行時間(GB-秒)に1GB-秒あたりの料金をかけ、実行時間に対する料金を計算すると、
        → 600,000 × 0.0000133334 = 8.00004
        → 少数第三位で四捨五入するので、実行時間に対する料金は 8.00 USD

    -------------

    [リクエスト数に対する料金は、、、]
    - 500,000 / 1,000,000 (100万件に対してのリクエスト割合) × 0.02 (リクエスト100万件あたりの料金) = 0.01 USD

    - 無料枠として 100万件分のリクエスト料金が無料になるのでリクエストの金額から 0.02 USD 分無料になる
        → 0.01 (発生する料金) - 0.02 (無料分) = -0.01 USD
        → よって、リクエスト数に対する料金は 0 USD

    -------------

    [ストレージの利用料金は、、、]
    - 512 MB を超過した分のストレージ容量は
        → 3072 - 512 = 2560 MB
        → 2560 / 1024 =  2,5 GB

    - ★★★　今月の Lambda 関数 A の実行時間を計算する (GB-秒ではなく秒)★★★
        → 500,000 (リクエスト数) × 1 (秒) = 500,000 (秒)        

    - 今月発生するストレージ料金は
        → 500,000 (実行時間(秒)) × 2.5 (ストレージ(GB)) × 0.000000037 (ストレージGB-秒に対する料金) = 0.04625 USD
        →少数第三位で四捨五入するので、ストレージに対する料金は 0.05 USD

    -------------

    [合計金額]
    8 (実行時間料) + 0.05 (ストレージ料) = 8.05 USD
    *その他に、データ転送料金がかかる場合もある
    ```

<br>

3. Provisioned Concurrency を利用するケース

    ```
    Lambda 関数 A に8時間 Provisioned Concurrency を有効にして運用した
    この時、プロビジョニングする実行環境の数は100に設定した
    この8時間のうちに50万件のリクエストを受け付けた
    Provisioned Concurrency が有効な時の Lambda 関数 A の平均実行時間は100ミリ秒
    メモリは 1536 MB (arm64)、ストレージはデフォルトの 512 MG を割り当てた
    リージョンは東京を選択した

    Q: この8時間での Lambda 関数 A の利用料金はいくらか?

    A:
    [実行時間(GB-秒)]
    - リクエスト数と Lambda 関数 A の平均実行時間から、総実行時間がわかる
        → 500,000 × 0.1 (平均実行時間(秒)) = 50,000 (秒)

    - Lambda 関数 A の総時間をGB-秒に直す
        → 50,000 (秒) × { 1536 / 1024 (メモリ(GB)) } = 75,000 (GB-秒)

    - ★ Provisioned Concurrency を有効にすると無料利用枠は適用されない

    - 上記で計算した総時間(GB-秒)に1GB-秒あたりの料金をかけ、実行時間に対しての料金を計算すると
        → 75,000 (GB-秒) × 0.0000100492 (USD) = 0.75369 (USD)
        → 少数第三位で四捨五入するので、実行時間に対する料金は 0.75 USD

    -------------

    [Provisioned Concurrency 利用料金]
    - Provisioned Concurrency の利用時間は
        → 8 (時間) × 60 (分) × 60 (秒) = 28,800 (秒)

    - Provisioned Concurrency の利用時間をGB-秒に直す
        → 28,800 (秒) × { 1536 ÷ 1024 (メモリ　(GB)) } = 43,200 (GB-秒)

    - 上記で計算した利用時間(GB-秒)に1GB-秒あたりのProvisioned Concurrency の利用料金及び、プロビジョニングした実行環境の数をかける
        → 100 (プロビジョニングした実行環境数) × 43,200 (GB-秒) × 0.0000043068 (USD) = 18.605376 USD
        → 少数第三位で四捨五入するので、Provisioned Concurrency の利用時間に対する料金は 18.61 USD

    -------------

    [ストレージの利用料金]
    - 割り当てたストレージ容量は 512 MB のため、追加料金は発生しない
        → よってストレージの利用料金は 0 USD

    -------------
    
    [リクエスト数に対する料金]
    - ★ 100万件分のリクエスト料金の無料利用枠は適用されないことに注意

    - リクエスト数(100万件あたり) に 100万件あたりのリクエスト料金をかける
        → 500,000 / 1,000,000 (100万件に対してのリクエスト割合) × 0.20 USD = 0.1 USD
        → よって、リクエスト数に対する料金は 0.1 USD

    -------------

    [合計金額]
    0.75 (実行時間料) + 18.61 (Provisioned Concurrency 利用料) + 0.1 (リクエスト料) = 19.46 USD
    *その他に、データ転送料金がかかる場合もある
    ```

<br>

4. 関数 URL を利用するケース

    ```
    Lambda 関数 A で関数 URL を利用した
    レスポンスの返却方法にはレスポンスストリームを選択した
    Lambda 関数 A が今月受け取ったリクエスト数は300万件であり、平均の実行時間は50ミリ秒であった
    リクエストあたりのペイロードサイズ(= レスポンスサイズ)は 7MB である
    メモリは 1536 MB, ストレージには 512 MBを割り当てた

    Q: 関数 URL の利用料はいくらか?

    A:
    - 6MBまでのペイロードは無料なので、有料分のパイロードのサイズは
        → 7MB - 6MB = 1MB

    - 上記で求めた料金が発生するペイロードサイズにリクエスト数をかけ、有料分の総ペイロードサイズを計算する
        → 1 MB × 3,000,000 (リクエスト数) = 3,000,000 (MB)
        → GB に直すと 3,000,000 (MB) / 1024 (MB) = 2,929.6875 (GB)

    - ★ 100GB 分のレスポンスストリーミング料金が無料枠で提供されるため、上記のペイロードサイズから無料となる 100GB 分を引く
        → 2,929.6875 (GB) - 100 (GB) = 2,829.6875 (GB)

    - 1GB あたりのペイロード処理にかかる料金をかける
        → 2,829.6875 (GB) × 0.008000 (USD per GB) =  22.639 (USD)
        → 少数第三位で四捨五入するので、関数URLの料金は 22.64 USD

    *そのほかにLambda関数の実行時間やリクエスト数、データ転送などの料金が発生する
    ```

<br>
<br>

参考サイト

[AWS Lambda 料金](https://aws.amazon.com/jp/lambda/pricing/)

[Lambdaの利用料金を整理したい](https://zenn.dev/shimo_s3/articles/0263536627e377)

[AWS Lambda が段階的な価格設定を発表](https://aws.amazon.com/jp/about-aws/whats-new/2022/08/aws-lambda-tiered-pricing/)

[【AWS Lambda】AWS Lambda Power Tuningでコストを1円でも安く](https://blog.serverworks.co.jp/lambda-powertuning)

[安い？それとも高い？Provisioned Concurrencyを有効化したLambdaのコストに関する考察 #reinvent](https://dev.classmethod.jp/articles/simulate-provisioned-concurrency-cost/)

---

### Savings Plans (SP)

- [EC2 の Savings Plans](./EC2_Savings-Plans.md) のように一定期間にわたってコンピューティングリソース1時間あたりの利用料金を払い続けることで割引を受けることができる購入方法

    -  Lambda の場合は最大 17% の割引を受けることができる

    - SP は `Cost Explorer` 画面のサイドメニューにある `Savings Plans` → `Savings Plansの購入` から購入することができる

    <img src="./img/Savigs-Plans_1.png" >

<br>

- ★ Lambda で購入できる SP は [Compute Savings Plans](./EC2_Savings-Plans.md) のみ

<br>

- Lambda の SP で割引が適用されるのは実行時間料金と Provisioned Concurrency 系の料金のみ

    - リクエスト数に対する料金やストレージ使用料には割引は適用されない

    <img src="./img/Lambda-Savings-Plans_1.png" />

<br>

#### 注意点

- Savings Plans (Compute Savings Plans) を購入した場合、他のリソース (EC2 や Fargate) がち稼働中かつそれらの方が割引率が高ければ Lambda でなくそちらに割引が優先的に適用される

    - [こちらの記事の説明](https://blog.jicoman.info/2020/04/understanding-how-savings-plans-apply-to-aws-usage/)がわかりやすい

<br>
<br>

参考サイト

[Lambda利用費が最大17%OFF!!Savings PlansがLambda Function実行時間に対応しました](https://dev.classmethod.jp/articles/savings-plan-update-save-up-to-17-on-your-lambda-workloads/)

[Savings Plans](https://aws.amazon.com/jp/savingsplans/compute-pricing/)

[【AWS】Savings Plans がどのように適用されるのかを理解する](https://blog.jicoman.info/2020/04/understanding-how-savings-plans-apply-to-aws-usage)

