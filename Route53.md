### Route 53 とは

AWS で 提供される DNS サービス

Route53 はグローバルサービス

主な機能
- ドメイン名の新規登録と管理
    - Route 53 でドメイン名を購入可能 (有料: 購入料、更新料など)
    - 外部サービスでドメイン名を取得し、それを Route53 で利用することも可能 (ドメインの移管が必要になる)

- DNS サーバーとしてドメインの名前解決を行う (権威 DNS サーバー)
- ヘルスチェック(ドメイン名と対応する IP のサーバーのヘルスチェックを行う)
- クライアントが入力したドメイン名に対して Route53 がどうルーティングするかを設定する機能  (ルーティングポリシーの設定)

<br>
<br>

参考サイト

ALBについてその1 -> [【初心者向け】Amazon Route 53 とは](https://www.sunnycloud.jp/column/20210602-01/)

ALBについてその2 -> [【図解AWS】Route53とは？初心者にもわかりやすく解説！](https://en-junior.com/route53)

---

### パブリックホストゾーンとプライベートホストゾーン

ホストゾーンは Route53 の概念であり、従来の DNS のゾーンファイルのイメージに違い

ホストゾーン = DNS レコードのコンテナ

<br>

2種類のホストゾーン
- パブリックホストゾーン
    - インターネット上に公開された DNS ドメインのレコードを管理するコンテナ
    - ネットからアクセスされるドメイン名の管理をするコンテナ
    - ドメイン名の取得が必要
    - ドメイン名とグローバル IP アドレスを紐づける

<img src="./img/Route53-Public-Hosted-Zone_1.png" />

<br>

- プライベートホストゾーン
    - VPC に閉じたプライベートネットワーク内の DNS ドメインのレコードを管理するコンテナ
    - VPC 内でアクセスされるドメイン名の管理をするコンテナ
    - Route53 や他のサービスからドメイン名を取得しなくても良い
    - ドメイン名とプライベート IP アドレスを紐づける

<img src="./img/Route53-Private-Hosted-Zone_1.png" />

<br>
<br>

参考サイト

パブリックホストゾーンとプライベートホストゾーンの違い、利用ケースの例などもあったサイト -> [【初心者向け】Amazon Route 53 とは](https://www.sunnycloud.jp/column/20210602-01/)

プライベートホストゾーンを利用して、VPC内でドメインメイン名でアクセスできるようにしている参考サイト -> [【Part 3/4】AWSの環境構築で学ぶトラブルシューティング【Route53】](https://envader.plus/article/262)

---

### ルーティングポリシーとは

Route53 (DNSサーバー) にドメイン名の解決の問い合わせが来たときに、どのように解決するかについての方針のこと

いくつかの方針(ポリシー)があり、 DNS レコードごとにポリシーを選択できる

<br>

代表的なルーティングポリシー

#### - シンプルルーティング
    - 1つの DNS A レコードに対し、1つの IP アドレスを返すようにルーティングするポリシー

    - 複数の IP アドレスを1つの A レコードに設定することもでき、その場合はランダムな IP アドレスにルーティングされる

<img src="./img/Route53-Simple-Routing_1.jpg.webp" />

引用: [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

<br>

#### - フェイルオーバールーティング
    - プライマリ (特に問題がない限りルーティングされるインスタンス) と セカンダリ (プライマリに異常が発生した場合にルーティングされるインスタンス)

    - Route53 のヘルスチェックによって、異常を検知する

<img src="./img/Route53-Failover-Routing-Policy_1.jpg.webp" />

引用: [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

<br>

#### - 加重ルーティング
    - 1つのドメイン名に対して2つの A レコードを作成し、各々のレコードに重みづけをする

    - ~%は IP アドレス xxx.xx.xx.x に、 ~%は yyy.yyy.yy.y にルーティングするというポリシー

<img src="./img/Route53-Weighted-Routing-Policy_1.jpg.webp" />

引用: [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

<br>

#### - 位置情報ルーティング
    - ユーザーのアクセス位置情報に基づいてルーティングする(接続先のサーバーを決める)ポリシー

    - 1つのドメイン名に対して2つの A レコードを作成し、各々のレコードでアクセス場所が~~だったら、IP アドレス xxx.xxx.xx.x にルーティングするという設定を行う

<img src="./img/Route53-Geolocation-Routing-Policy_1.jpg.webp" />

引用: [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

<br>

#### - 地理的近接性ルーティングポリシー
    - 位置情報ルーティングに似ている

    - ユーザーのアクセス位置情報と、リソース(サーバー)の位置情報に基づいてルーティングするポリシー

    - このポリシーを設定するためには、Route53 のトラフィックフローという機能を使用する必要がある

<img src="./img/Route53-Geoproximity-Routing-Policy_1.jpg.webp" />

引用: [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

<br>

#### - レイテンシールーティング
    - レイテンシーが最小になるリソースを優先的にアクセスさせるルーティングするポリシー

    - レイテンシーの計測計測の対象は AWS のリソースのみなので、オンプレなどのリソースに対してレイテンシールーティングを設定した場合、十分に機能しない可能性がある

<img src="./img/Route53-Latency-Routing-Policy_1.jpg.webp" />

引用: [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

<br>

#### - 複数値回答ルーティングポリシー
    - 1つのドメイン名に対して複数の A レコードを作成し、ヘルスチェックで正常と判断された IP にランダムにルーティングするポリシー

    - シンプルルーティングとの比較
        -  同じ
            - 1つのドメイン名に対して複数の A レコードを作成できる
            - ドメイン名に対応する IP アドレスをランダムにルーティングする

        - 違い
            - シンプルルーティングポリシーではヘルスチェックを行うことができない

<img src="./img/Route53-Multivalue-Answer-Routing-Policy_1.jpg.webp" />

引用: [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

<br>

#### - IPベースルーティングポリシー
    - アクセス元のIP アドレス範囲に応じてトラフィックをルーティングするポリシー
    
    - 利用例
        - 社内のネットワークアドレスに属している IP アドレスから対象のドメイン名でのアクセスは xxx.xxx.xx.x にルーティングする
        - それ以外の一般のユーザーから対象のドメイン名でのアクセスは yyy.yyy.yy.y にルーティングする

<img src="./img/Route53-IP-Based-Routing-Policy_1.png.webp" />

引用: [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

<br>
<br>

参考サイト

各ルーティングポリシーの説明画像がとてもわかりやすかったサイト -> [【AWS初学者向け・図解】Route53ルーティングポリシーを現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-route53-routingpolicy-beginner/)

各ルーティングポリシーの設定方法の説明をしているサイト -> [[初心者向け]Route53のトラフィックルーティングを実装する](https://dev.classmethod.jp/articles/implement-route53-routing-for-begineer/)

公式の各ルーティングポリシーについての説明ページ -> [Choosing a routing policy](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html)

---

### Route53 にかかってくる料金

- 以下のような料金が発生してくる

    - DNSクエリへの応答時に発生する費用

    - ホストゾーンの維持・管理に発生する費用

    - Route53 でドメイン名を取得した場合、取得したドメインの維持費用

        - Route53 以外取得したドメインでも、 Route53 に移管する場合移管の費用が発生する

    - ヘルスチェックの利用料金

    - そのほかの Route53 の追加機能の利用料金

<br>

#### DSN クエリへの料金

<img src="./img/Route53-Cost_1.png" />

引用: [Amazon Route 53 料金表](https://aws.amazon.com/jp/route53/pricing/)

<br>

- ★★パブリックホストゾーンに対するクエリのみにクエリ料金が発生する

- ★設定しているルーティングポリシーによって金額が異なる

    - [レイテンシールーティング](#--レイテンシールーティング)でのクエリは 100 万件あたり 0.60 USD (最初の10 億件まで)

    - [位置情報ルーティング](#--位置情報ルーティング)や[地理的近接性ルーティングポリシー](#--地理的近接性ルーティングポリシー)でのクエリは 100 万件あたり 0.70 USD (最初の10 億件まで)

    - [ipベースルーティング](#--ipベースルーティングポリシー)でのクエリは 100 万件あたり 0.80 USD (最初の10 億件まで)

    - 上記以外のルーティングポリシーでのクエリは 100 万件あたり 0.40 USD (最初の10 億件まで)

<br>

#### ホストゾーンの維持・管理に発生する料金

<img src="./img/Route53-Cost_2.png" />

引用: [Amazon Route 53 料金表](https://aws.amazon.com/jp/route53/pricing/)

<br>

- 1つのホストゾーンあたり、 0.50 USD (最初の25個のホストゾーンまで)

<br>

#### ヘルスチェックの利用料金

<img src="./img/Route53-Cost_3.png" />

引用: [Amazon Route 53 料金表](https://aws.amazon.com/jp/route53/pricing/)

- ★Route53 を利用している AWS アカウントにリンクされた AWS へのエンドポイントへのヘルスチェックならば 50 個までは無料

<br>

#### 取得・維持するドメインに対して発生する料金

- 購入費用

    - Route53 でドメインを購入する際に発生する費用

<br>

- 移管費用

    - 他のレジストラ (ドメイン登録申請を受け付け、販売する業者) で取得ドメインを Route53 に管理を移行する際に発生する費用

    - 上記とは逆に Route53 で取得したドメインを他のレジストラに管理を移行させるときも同じ費用が発生する

<br>

- 復元費用

    - 復元: 失効したドメインを再び有効にすること

        - ドメインの更新を忘れたりすると失効する

    - Route53 で失効したドメインの復元にかかる費用

<br>

- 所有者変更の費用

    - ドメインの所有者 ＝ ドメインを購入する際に登録した購入者

    - 一部のドメイン (トップレベルドメイン) では、所有者の変更に料金が発生する

<br>

- ★上記の費用 (購入 / 移管 / 復元) は トップレベルのドメイン (com や org など) によって金額が異なる

- 詳しく[公式のRoute53の料金ページ](https://aws.amazon.com/jp/route53/pricing/)を参照

<br>
<br>

参考サイト

[Amazon Route 53 料金表](https://aws.amazon.com/jp/route53/pricing/)

[Route 53の失効したドメインを復元してみた](https://dev.classmethod.jp/articles/restore-expired-jp-domain/)

[ドメインの連絡先情報と所有者の更新](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/domain-update-contacts.html)

---

### Route 53 ヘルスチェック

- 設定した間隔で自動リクエストをインターネット経由でリソースに送信し、そのリソースが到達可能、使用可能、機能中であることを確認する機能

- 詳しくは[こちら](./Route53_ヘルスチェック作成.md)を参照

---

### 位置情報ルーティングと地理的近接性ルーティング の違い

<br>
<br>

参考サイト

[【Route53】位置情報ルールと地理的近似性を完全に理解した【ルーティングポリシー】](https://syuntech.net/aws/route53_routing/)