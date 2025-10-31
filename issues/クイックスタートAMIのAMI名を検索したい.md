### 事象

- マネージドコンソール → EC2 → AMI カタログ の Amazon が提供しているクイックスタート AMI の AMI 名 (≠ AMI ID) を調べる方法がわからなかった

    <img src="../img/Issue-Research-AMI-Name_1.svg" />

    <br>

    → CDK にて aws_ec2.Instance を作成する際に、特定のAMI をベースにインスタンスを作成したい時に、 AMI 名 を事前に知っておく必要がある

---

### 解決策

- マネージドコンソール → EC2 → AMI から検索可能

    <img src="../img/Issue-Research-AMI-Name_2.svg" />

<br>
    
- AMI 画面左上にあるドロップダウンリストから、検索対象の AMI の種類を `パブリックイメージ` に変更 + 右隣のテキストボックスに検索条件を追加していくことで、任意の AMI の AMI 名を検索することが可能

    <img src="../img/Issue-Research-AMI-Name_3.svg" />

<br>
<br>

参考サイト

[【AWS】マーケットプレイスのAMIのAMI IDを調べる方法](https://atsum.in/aws/find-ami-id/)