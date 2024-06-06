### VPC にて作成したサブネットをネットワークに接続したい (Internet Gateway)

作成したサブネットをパブリックサブネットにするには

- ~~Internet Gateway を作成し、サブネットとインターネットを接続する必要がある~~
↑間違いではないが、具体的なイメージが間違っていた[勘違いしていたこと参照](#misunderstand)

<br>

Internet Gateway を利用することで、 **パブリックサブネット内のリソース(EC2インスタンスなど)が外部からインターネット経由でアクセス可能になる**

---
<div id="misunderstand"></div>

### インターネットゲートウェイについて勘違いしていたこと

インターネットゲートウェイと VPC 内のパブリックにしたいサブネットを接続すると思っていた

<img src="./img/Internet-Gateway_5.png" />

<br>

実際は
$\color{red}{Internet Gateway は VPC 自体にアタッチされる}$

<br>

Internet Gateway の役割は
$\color{red}{VPC 内部サブネットに配置されたインスタンスのプライベート IP アドレスとそのインスタンスのパブリックIP/Elastic IP を1対1で変換すること
}$

\* パブリック IP / Elastic IP は 一見インスタンスに付与されているように見えるが、実際はインスタンスが自身のパブリック IP を知っていることはなく、インターネットゲートウェイの方で変換を行なっている

<img src="./img/Internet-Gateway_6.png" />

[【AWS】VPCとは？【使用する上で避けられない基礎知識を徹底解説。】](https://katsuya-place.com/what-is-vpc/)

参考1: [インフラエンジニアに贈るAmazon VPC入門 #3 インターネット接続(前編): Elastic IP ≒ Static NAT!!](https://dev.classmethod.jp/articles/vpcfor-infra-engineer-3/#toc-11)

参考2: [インターネットゲートウェイ部分](https://katsuya-place.com/what-is-vpc/)

---

### Internet Gateway の作成方法

1\. VPC ダッシュボードより「インターネットゲートウェイ」を選択し、インターネットゲートウェイ一覧画面より「インターネットゲートウェイの作成」ボタンをクリックする

<img src="./img/Internet-Gateway_1.png" />

<br>

2. 作成画面にて、インターネットゲートウェイにつけるタグ名を設定し、「インターネットゲートウェイの作成」ボタンをクリック

<img src="./img/Internet-Gateway_2.png" />

<br>

3\. 作成したインターネットゲートウェイから 「VPCにアタッチ」ボタンをクリックする

<img src="./img/Internet-Gateway_3.png" />

<br>

4\. VPC にアタッチ画面にてアタッチする VPC を選択し、「インターネットゲートウェイにアタッチ」ボタンをクリックする

<img src="./img/Internet-Gateway_4.png" />

<br>

$\color{red}{インターネットゲートウェイの作成だけでは、まだインターネットに接続することはできない}$

---

### NAT Gateway

役割: プライベートサブネット内の IP を NAPT 変換する

```
ルーターの NAPT のように  

- プライベートIP + ポート <=> グローバルIP + ポート  

の変換ではなく

- サブネット内のプライベートIP + ポート　<=> NATゲートウェイのプライベートIP + ポート

の変換を行う
```

<br>

必要なケース

**サブネット側からインターネット接続はできても、インターネットからサブネットにアクセスできないような**

$\color{red}{1方向のインターネット接続}$

**を確立したい場合**

<img src="./img/NAT-Gateway_1.png" />

\*上記画像はあくまでイメージ図で、実際のNATゲートウェイの配置位置は違う

---

### NAT Gateway について追記

NAT ゲートウェイは パブリックサブネットに配置する必要がある

- プラーベートサブネット内のインスタンスの代わりにインターネットにアクセスする為、 NAT ゲートウェイはインターネット接続可能なサブネットに配置される必要がある

<img src="./img/NAT-Gateway_2.png" />

[NAT ゲートウェイのユースケース](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/nat-gateway-scenarios.html)

---

### Internet Gateway と NAT Gateway の違い

利用金額や使用料金が発生する条件なども違う

- Internet Gateway
    - 作成、アタッチだけでは使用料金は発生しない
    - 実際にインターネット通信が発生した場合に資料料金が発生

- NAT Gateway
    - 作成、配置しただけで使用料金が発生する
    - 上記の料金に加え、NATゲートウェイ経由の通信が発生するとその通信量に応じて課金される

参考: [VPCと外部ネットワーク・サービスとの接続](https://qiita.com/c60evaporator/items/2f24d4796202e8b06a77#vpcと外部ネットワークサービスとの接続)

---

### VPC をインターネットに接続する