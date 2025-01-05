### API Gateway の作成

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

### その他の項目

#### カスタムドメイン

- 自分で取得したドメインを API に割り当てることができる

<img src="./img/API-Gateway-Custom-Domain_1.png" />

<br>

#### VPC リンク

- VPC内のリソースにアクセスするために VPC リンクというものを作成できる

<img src="./img/API-Gateway-VPC-Link_1.png" />