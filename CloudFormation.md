### Could Formation とは

- テキストファイル (JSON や YAML) で AWS リソースを自動で作成するサービス

    - Infrastructure as Code (IaC) のサービス

- 複数のリソース (インスタンス) からなる AWS 環境も CloudFormation を利用すれば1つのテキストファイルから作成することができる

<br>

#### メリット

- コンソールで作成する際のヒューマンエラーを減らすことができる

- Docker のように何度も壊して再作成するような環境には便利

- CouldFormation 自体の利用料金は無料

    - 作成するリソースには料金が発生する

    - アップロードするテンプレートファイルはS3に保存されるのでS3の利用料金は発生する

<br>
<br>

参考サイト

[【AWS入門】CloudFormationとは｜基礎からわかりやすく解説](https://techmania.jp/blog/aws0009)

---

### CloudFormaion を理解するための用語とその理解

#### テンプレート

- リソースの定義を記述したテキストファイル (JSON や YAML) のこと

    - テンプレートを元に AWS リソースを作成する

<br>

#### スタック

- テンプレートによって作成されるリソースの集まり

    - 例: 1つのテンプレートから EC2, S3, Lambda を作成

        → 作成した EC2, S3, Lambda は1つのスタック

<br>

- ★CloudFormation はスタック単位での作成/削除/管理を行うため、スタックの中の1つのリソースを削除するような操作はできないことに注意

<br>
<br>

参考サイト

[初学者のためのCloudFormation超入門（概要理解編）](https://www.isoroot.jp/blog/6587)

[【AWS入門】CloudFormationとは｜基礎からわかりやすく解説](https://techmania.jp/blog/aws0009)

[【初心者向け】AWS CloudFormation 入門！完全ガイド](https://zenn.dev/issy/articles/zenn-cfn-overview)