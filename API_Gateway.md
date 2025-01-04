### API Gateway とは

- Web API を作成、公開、管理するフルマネージドなサービス

    - REST API, WebSocket API, HTTP API の作成などが可能

    - API用のサーバーを自前で用意する必要がなく、開発者は API の開発、保守のみに注力することができる

<br>

- API Gateway はリージョンサービス

<br>
<br>

参考サイト

[さっくり解説するAmazon API Gateway](https://qiita.com/shimajiri/items/2fb424629d9ddb9c9ef1)

---

### API Gateway での用語とコンセプト

#### リソース

<img src="./img/API-Gateway-Resource_1.png" />

<br>

- HTTPリクエストを受け取る特定のパス

- ★定義したリソース (= パス) に対してメソッド (GET/POST.PUT/DELETE) とバックエンドサービスを紐づける

<br>

#### ステージ

<img src="./img/API-Gateway-Stage_1.png" />

<br>

- デプロイ環境のこと

- ステージごとに　API の状態を分けて管理することができる

- 各ステージのエンドポイントの URL にはステージ名が含まれる

    <img src="./img/API-Gateway-Stage_2.png" />

<br>

#### API キー

<br>

#### Autorizer (オーソライザー)

<br>

#### モデル

<br>

#### リクエスト

- メソッドリクエスト

- 統合リクエスト

<br>

#### レスポンス

- メソッドレスポンス

- 統合レスポンス


参考サイト

[イラストで理解するAPI Gateway](https://zenn.dev/fdnsy/articles/86897abce0bbf5)

---

### REAT API と HTTP API

#### 広義の意味

- HTTP API

    - HTTP プロトコルを利用して機能を提供しているプログラムのことを指す

<br>

- REST API

    - HTTP プロトコルを利用して機能を提供しているプログラムのこと

        - ★(広義の意味で) REST API は　HTTP API に属している

    <br>

    - REST API の特徴として、リソース（データ）を URI で指定し、HTTP メソッド（GET、POST、PUT、DELETE など）を使用してリソースを操作する


<br>

#### 狭義 (API Gateway 上) の意味

- API Gateway 上で提供される製品の違い

- HTTP API

    - シンプルで低コスト、低レイテンシーな RESTful API を作成できる製品

- REST API

    - HTTP API より高度な機能やセキュリティ、管理機能が必要な RESTful API の作成ができる製品

##### ポイント

- API Gateway 上では HTTP API, REST API のどちらとも RESTful API 製品である

- ★各 API によって利用できる[機能](./API_Gateway_Functions.md)に差がある

- HTTP API の方が REST API よりも低価格で利用できる


<br>
<br>

参考サイト

広義の意味での HTTP API と REST API
- [徹底解説：REST APIとHTTP APIとの相違点などを](https://apidog.com/jp/blog/how-rest-api-differs-from-http-api/)

狭義の意味での HTTP API と REST API
- [AWS API GatewayのHTTP APIとREAT APIの違い](https://qiita.com/pike3/items/54401975793b4750f180)
- [Amazon API Gatewayは「HTTP API」と「REST API」のどちらを選択すれば良いのか？ #reinvent](https://dev.classmethod.jp/articles/amazon-api-gateway-http-or-rest/)
- [REST API と HTTP API のどちらかを選択する](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/http-api-vs-rest.html)

---

### コスト
