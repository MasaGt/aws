### API の作成

1. マネージドコンソールより API Gateway 画面に遷移し、`API` をクリック

    <img src="./img/API-Gateway-Create_1.png" />

    <img src="./img/API-Gateway-Create_2.png" />

<br>

2. 今回は外部からアクセスできる REST API を作成するので REST API の `構築`を選択する

    <img src="./img/API-Gateway-Create_3.png" />

<br>

3. API の作成方法を選択する

    - 新しい API

        - 1から自分で API を作成する方法

        <img src="./img/API-Gateway-Create_4.png" />

    <br>

    - 既存の API をクローン

        - すでに作成ずみの API をコピーして作成する方法

        <img src="./img/API-Gateway-Create_5.png" />

    <br>

    - API をインポート

        - OpenAPI や Swagger といった定義ファイルから API を作成する方法

        <img src="./img/API-Gateway-Create_6.png" />

    <br>

    - サンプル API

        - AWS が用意しているテンプレートをもとに API を作成する方法

        <img src="./img/API-Gateway-Create_7.png" />

<br>

4. 作成する API の[エンドポイントタイプ](./API_Gateway_Functions.md#エンドポイントタイプ)を選択する

    - 今回は `リージョン` を選択

    <img src="./img/API-Gateway-Create_8.png" />

<br>

5. API の作成方法とエンドポイントタイプを選択したら `APIを作成` をクリック

    <img src="./img/API-Gateway-Create_9.png" />

---

### リソースの作成

- パスを追加する

    - API Gateway でのリソースというものの理解については[こちら](./API_Gateway.md#リソース)を参照

<br>

#### リソースの追加手順

1. マネジードコンソールの API Gateway 画面のサイドメニューから `API` を選択し、リソースを追加したい API をクリックする

    <img src="./img/API-Gateway-Create-Resource_1.png" />

<br>

2. サイドメニューの `リソース` からリソース画面に遷移し、 `リソースを作成` ボタンをクリック

    <img src="./img/API-Gateway-Create-Resource_2.png" />

<br>

3. 追加したいパス名 (= リソース) を入力し、 `リソースを作成` ボタンをクリック

    - プロキシリソース

        - greedy パス変数を使用したパスのこと

        - greedy パス変数 (`{proxy+}`) を利用して、 greedy パスより深いパスを指定したリクエストも全て greedy なリソースで受け取る

            ```
            [例]
            リソースパス: /user
            greedy 変数: {proxy+}
            
            上記の設定で作成したプロキシリソースは /user 以降のパスを指定した全てのリクエストを受け取る

            /user でも /user/search でも /user/dept/area/ でも
            ```

    <br>

    - CORS (クロスオリジンリソース共有)

        - API Gateway で作成する当 API の CORS を有効にするかどうか

        - 異なるオリジンから API Gateway で作成する API を呼び出したい場合に有効にする必要がある

    <br>

    <img src="./img/API-Gateway-Create-Resource_3.png" />

<br>
<br>

参考サイト

プロキシリソースオプションの greedy パス変数について
- [【新機能】Amazon API Gatewayの設定方法にcatch-allパス変数、ANYメソッド、Lambdaとの新しいプロキシ連携の3機能が追加。](https://dev.classmethod.jp/articles/api-gateway-adds-three-features/)
- [API Gatewayで/{proxy+}メソッドを活用する方法](https://qiita.com/hatsukaze/items/12f9ec31fcacc73f2e50#1-proxyメソッドとは)
- [API Gateway のアップデート – API 開発を簡素化する新機能](https://aws.amazon.com/jp/blogs/news/api-gateway-update-new-features-simplify-api-development/)

API Gateway の CORS について
- [Amazon API Gateway をクロスオリジンで呼び出す (CORS)](https://dev.classmethod.jp/articles/amazon-api-gateway-cors/)
- [[AWS CDK] API Gateway(REST API)のCORSの動作を確認してみた](https://dev.classmethod.jp/articles/cors-on-rest-api-of-api-gateway/)

---

### その他の項目

#### カスタムドメイン

- 自分で取得したドメインを API に割り当てることができる

<img src="./img/API-Gateway-Custom-Domain_1.png" />

<br>

#### VPC リンク

- VPC内のリソースにアクセスするために VPC リンクというものを作成できる

<img src="./img/API-Gateway-VPC-Link_1.png" />