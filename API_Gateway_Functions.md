###  エンドポイントタイプ

- 作成 & デプロイする API を呼び出す方法に関する種類のこと

- 以下の3種類のエンドポイントタイプがある

    - エッジ最適化 (Edge-optimized)

        - アクセス元から最も近い CloudFront のエッジサーバーを経由して API Gateway にデプロイされている API にアクセスする

        <img src="./img/API-Gateway-Edge-Opitimized_1.png" />

    <br>

    - リージョン別

        - クライアントからリージョンの REST API に直接リクエストする

        <img src="./img/API-Gateway-Region_1.png" />

    <br>

    - プライベート

        - インターネット経由でアクセスできず、 VPC内からしかアクセスできない
        
        <img src="./img/API-Gateway-Private_1png.png" />

<br>
<br>

参考サイト

[API とは ? ~ Amazon API Gateway でできること ~](https://aws.amazon.com/jp/builders-flash/202004/awsgeek-api-gateway/)

---

### セキュリティ

- 悪意のあるユーザーやトラフィックの急増など、特定の脅威から API を保護する方法

#### 相互 TLS 認証

- クライアントとサーバーの双方向認証
    
    - ★通常の TLS 認証とはクライアントから見てサーバーが信頼していいサーバーかどうかを判断するための手段 (クライアント側も SSL 証明書を提示する)

    <img src="./img/mTLS_1.jpeg" />

    引用: [TLS相互認証（mTLS）とは、APIのmTLSを実装する](https://apidog.com/jp/blog/how-to-proceed-mtls-api/)

<br>

- 相互 TLS を利用するには以下のような条件がある

    - クライアント証明書を作成する必要がある

    - S3 にクライアント証明書をアップロードする必要がある

    - 相互 TLS を利用したい API にはカスタムドメイン名を設定する必要がある

<br>

#### バックエンド認証用の証明書

- API Gateway に SSL 証明書を置き、その接続先となるバックエンドに公開鍵を配置する認証方法

    - バックエンド側で送られてきたリクエストが　API Gatway からのものであることを確認する

    <img src="./img/API-Gateway-SSL-for-Backend_1.png" />

<br>

#### AWS WAF

- AWS WAF (Web Application Firewall) を利用して API を守る機能

    <img src="./img/API-Gateway-WAF_1.webp" />

    引用: [AWS WAF ＋ API Gateway構成をカウントモードで構築し、ルールに該当するリクエストのログを取得してみた](https://dev.classmethod.jp/articles/output-requestlog-cloudwatch-aws-waf-api-gateway-count-mode/)

<br>
<br>

参考サイト

相互 TLS そのものについて
- [TLS相互認証（mTLS）とは、APIのmTLSを実装する](https://apidog.com/jp/blog/how-to-proceed-mtls-api/)

API Gateway での相互 TLS について
- [相互 TLS 認証でサーバーレス API にアクセスする方法 (AWS Private CA)](https://blog.serverworks.co.jp/api-gateway-mutual-tls-auth)

WAF の利用について
- [AWS WAF ＋ API Gateway構成をカウントモードで構築し、ルールに該当するリクエストのログを取得してみた](https://dev.classmethod.jp/articles/output-requestlog-cloudwatch-aws-waf-api-gateway-count-mode/)
- [CDN+WAF+SPAの基本をAWSで簡単に構築する無料日本語ハンズオンを受講しました](https://dev.classmethod.jp/articles/handson-for-beginners-cloudfront-waf/)

--- 

### 認証

- バックエンドへのアクセス制御

#### IAM

<br>

#### リソースポリシー

<br>

#### Amazon Cognito

---

### API 管理

#### カスタムドメイン

- 独自のドメイン名で API を公開することができる機能

<br>

#### API キー

<br>

#### クライアント毎のレート制限

<br>

#### クライアント毎の使用量制限

---

### 開発

#### CORS

<br>

#### テスト呼び出し

<br>

#### キャッシュ

- 

- ★別途利用料金が発生する

<br>

#### ユーザー制御のデプロイ

<br>

#### 自動デプロイ

<br>

#### カスタムゲートウェイレスポンス (Custom Gateway Response)

- エラーレスポンスのカスタマイズ

<br>

#### カナリアリリースデプロイ

- 新しバージョンの API を

<br>

#### リクエストの検証

<br>

#### リクエストパラメータ変換

<br>

#### リクエスト本文変換

---

### モニタリング

#### Amazon CouldWatch メトリクス

#### CouldWatch Logs へのアクセスログ

- API へのアクセスログを CoudlWatch Logs に記録することができる

#### 実行ログ

- 

---

### 統合

####

