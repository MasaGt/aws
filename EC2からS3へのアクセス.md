### IAM ロールの作成

EC2 に付与する S3 へのアクセス権限を作成する

1. AWS の IAM ダッシュボードより、「ロール」画面の「ロールを作成」をクリック

<img src="./img/S3-Access_1.png" />

<br>

2. 今回は EC2 にアタッチするロールなので、「AWSサービス」を選択し、ユースケースに「EC2」を選択

<img src="./img/S3-Access_2.png" />

<br>

3. ロールに割り当てる S3 へのアクセス権限ポリシーを選択する

<img src="./img/S3-Access_3.png" />

<br>

4. 作成するロールの名前をつけ、「ロールの作成」をクリック

<img src="./img/S3-Access_4.png" />
<img src="./img/S3-Access_5.png" />

<br>

---

### IAM ロールを EC2 にアタッチする

1. AWS の EC2 ダッシュボードより、「インスタンス」画面で対象のインスタンスを選択する

<img src="./img/S3-Access_6.png" />

<br>

2. 選択したインスタンスに対し、「アクション」 → 「セキュリティ」 → 「IAM ロールを変更」をクリック

    *複数インスタンスを選択すると「IAM ロールを変更」がグレーアウトで選択できなくなるので、1つずつロールのアタッチを行う必要がある

<img src="./img/S3-Access_7.png" />

<br>

3. S3 へのアクセス権限のロールを選択し、「IAM ロールの変更」をクリック

<img src="./img/S3-Access_8.png" />

---

### EC2 から S3 へアクセスしてみる

1. EC2 に SSH で接続

<img src="./img/S3-Access_9.png" />

<br>

2. 適当なテキストファイル(S3にアップロードするファイル)を作成

<img src="./img/S3-Access_10.png" />

<br>

3. aws s3 コマンドで EC2 のローカルファイルを S3 にアップロードする

```bash
aws s3 cp アップロードするファイル s3://バケット名
```

<img src="./img/S3-Access_11.png" />

<br>

4. S3 ダッシュボードの「バケット」より、対象ばけっおｔにファイルがアップロードされたか確認する

<img src="./img/S3-Access_12.png" />

*ファイルをそのままS3内で放置していると、ストレージ料金が発生するので、必要なかったら削除する

<br>

その他の aws s3 コマンドは以下の qiita の記事で紹介されている
- [AWS CLIでS3を操作するコマンド一覧](https://qiita.com/uhooi/items/48ef6ef2b34162988295)