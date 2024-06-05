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

---

### NAT Gateway



---

### Internet Gateway と NAT Gateway の違い