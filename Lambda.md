### Lambda とは

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

    - 1つのエイリアスは最大で 2つのバージョンにつけることが可能

- エイリアスはいつでも付け替え可能

<br>

#### レイヤー

- 複数の Lambda 関数 で共通するコードを zip に切り出して共有することができる機能

    - 同じライブラリを利用する Lambda 関数が複数ある場合、そのライブラリをレイヤーに切り離すことができる

- うまくレイヤーに切り離すことで、Lambda 関数自体のサイズを小さくすることができる

- ★ レイヤーもバージョン管理が可能

<br>

#### extensions

- TODO: extensions について追記する

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

コールド/ウォームスタートについて
- [AWS Lambda 関数の実行の仕組みを知ろう !](https://aws.amazon.com/jp/builders-flash/202308/learn-lambda-function-execution/)
- [サーバレス時代の必須技術、AWS Lambdaを知ろう](https://www.itis.nssol.nipponsteel.com/blog/aws-lambda-01.html)

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

- プロビジョニングされた同時実行数の利用には追加料金がかかる


<br>

#### 関数URL

<img src="./img/Lambda-Function-URLs_1.jpg" />

引用: [AWS Lambda 関数URLを設定しアクセスする方法【基礎】](https://kacfg.com/aws-lambda-function-urls-basic/)

<br>

- API Gateway を利用せずに、Lambda 関数 をHTTP(S) 公開する機能

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

---

### コスト

- Lamda を作成しただけでは料金は発生しない

- 実行時間に対して料金が発生する