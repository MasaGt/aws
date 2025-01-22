### AWS ELB とは

AWS でのロードバランサーを提供するサービスはElastic Load Balancing (ELB)

ELB で利用できるロードバランサーは複数の種類がある

- #### ALB (Application Load Balancer)
    - 利用するには、2 AZ (Availability Zone) 以上が必要（1 AZ では起動できない
    - ロードバランサー自体への固定 IP 付与はできない
    - 対応プロトコル: HTTP、HTTPS
    
<br>

- #### NLB (Network Load Balancer)
    - 1 AZ または複数 AZ の指定が可能
    - ロードバランサー自体への固定 IP 付与可能
    - 対応プロトコル: TCP、UDP、TLS
    - SSL 化処理を持たせることができる
    - 1秒あたり数百万リクエストを処理可能

<br>

- #### GLB (Gateway Load Balancer)
    - 1 AZ または複数 AZ の指定が可能
    - ロードバランサー自体への固定 IP 付与はできない
    - 対応プロトコル: HTTP、HTTPS, TCP
    - AWS 上でサードパーティのセキュリティ製品(ファイアウォールなど)と組み合わせて使いたい場合に便利(**たぶん**)

<br>

*利用するロードバランサーによって料金が異なる

<br>

#### どのように使い分けをしたら良いのか?

ALB を選ぶケース
- HTTP,HTTPS リクエストの分散処理を行いたい
- ロードバランサーに SSL 化処理を行わせたい
- Web サービスを提供するケースで特に理由がなければ多分 ALB

<br>

NLB を選ぶケース
- 高速に処理を行わせたい、数秒間に何百万リクエストを捌かせたい
- リアルタイムのゲームとか
- HTTP/HTTPS以外のTCP、UDPを使用する場合

<br>

GLB を選ぶケース
- サードパーティのセキュリティ製品と組み合わせたい場合とか?

<br>
<br>

参考サイト

[【初心者向け】Elastic Load Balancing(ELB) 入門！完全ガイド](https://zenn.dev/issy/articles/zenn-elb-overview#albapplication-load-balancer)

[AWSのロードバランサーとは？　ALB・NLBの違いと用途について](https://business.ntt-east.co.jp/content/cloudsolution/ih_column-26.html#section-6)

---

### ALB (Application Load Balancer)

ポイント1
- アクセスの経路: ユーザー -> ロードバランサー -> プライベートサブネットに配置されたインスタンス
    - ロードバランサーから NAT ゲートウェイを経由してプラベートサブネットにアクセスはしない
    - $\color{red} NAT ゲートウェイはプライベートサブネットからインターネットアクセスの時に経由される$

<img src="./img/ALB_1.png" />

引用: [AWSのロードバランサーとは？　ALB・NLBの違いと用途について](https://business.ntt-east.co.jp/content/cloudsolution/ih_column-26.html)

<br>

ポイント2
- ロードバランサーにサーバー証明書を配置し、インターネット間の通信を HTTPS (SSL 暗号化) で行うことができる

- 一方で、ロードバランサーと VPC 上の Web サーバーなどのインスタンス間の通信は HTTP で行うことで、 Web サーバーの負荷を減らしたり、鍵の管理を楽にすることができる

<img src="./img/ALB_2.png"/>

<br>

ポイント3
- **インターネットからのアクセスを割り振りたい場合**
、ALB を作成する際にロードバランサーに Public Subnet を関連づける必要がある

    - イメージ的には ALB をパブリックサブネットに配置するイメージ

<br>

ポイント4
- ALB はポートフォーワーディング機能も持つ
    - ロードバランサーは https(443) ポートでインターネットからのアクセスを待ち受け

    - アクセスを受けた場合、 プライベートサブネットにある http 通信を 8080 ポートで待ち受けているインスタンスにリクエストを送る (設定によって他ポートでも可)

    - AWS 上で[ターゲットグループ](TargetGroup.md#target-group)の作成が必要

<img src="./img/ALB_3.png" />

<br>

ALB についての参考サイト1: [ロードバランサーのサブネットとルーティング](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/load-balancer-stickiness/subnets-routing.html)

---
<div id="health-check"></div>

### ヘルスチェックとは

サーバーに異常が起きていないかを確認するために、ロードバランサーから定期的に振り分け先のサーバーにリクエストを送ること

<br>

#### ヘルスチェックの種類
- アクティブ型
    - ロードバランサーからリクエストを振り分ける対象のサーバーにリクエストを送り、そのレスポンスを監視する方法

<br>

- パッシブ型
    - サーバーのクライアントへのレスポンスを監視する方法
    - ロードバランサーからはヘルスチェックのリクエストを送信しないのがポイント

<br>

#### ヘルスチェックの方法 (アクティブ型)

-  pingチェック (IP レベルのチェック)
    -　ping　が通るかのチェック

<br>

- ポートチェック (TCP レベルのチェック)
    - SYN パケット（接続要求）を送付し、それに対する ACK パケット（確認応答）が返ってくるかどうかをチェックするらしい

<br>

- HTTP(S) チェック (コンテンツレベルのチェック)
    - サーバーへの HTTP(S) リクエストのレスポンスをチェックする
    - ALB のヘルスチェックがこれ

<br>

ポイント
- ヘルスチェックとは ELB 特有の機能ではなく、ロードバランサー全般が持つ機能のこと

<br>
<br>

参考サイト

ヘルスチェックの種類について
- [F5 GLOSSARYヘルスチェック](https://www.f5.com/ja_jp/glossary/health-check)

ヘルスチェックの方法について
- [ダウンサーバを回避して接続を維持する](https://atmarkit.itmedia.co.jp/ait/articles/0303/05/news001.html)

---

### 利用料金

ロードバランサーの料金が発生する仕組み

- 作成し、そのままにしておくと利用１時間ごとに使用料が発生する

- ロードバランサーへの接続アクセス数/処理したバイト数などのうち、**一番使用量の多い要素にのみ** に対してさらに費用が発生する

<br>

ロードバランサーの料金についての参考サイト: [【AWS入門】AWSのELBとは？ロードバランサーの種類、特徴、料金を紹介](https://cloudnavi.nhn-techorus.com/archives/3640#ELB)
