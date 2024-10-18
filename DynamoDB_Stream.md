### DynamoDB Stream とは

#### 概要

- DynamoDBテーブルのアイテムに対する変更(作成、更新、削除)を検出し、その変更を履歴として保存できる機能

<img src="./img/DynamoDB-Stream_1.png" />

引用: [DynamoDBを語ってみる](https://tech.nri-net.com/entry/talk_about_dynamodb)

<br>

#### 詳しい仕組み

- DynamoDB Stream は複数のシャードで構成されている
    - シャードとは複数のストリームレコードを格納するパイプのようなもの

    - ストリームレコードとは、DynamoStream が有効なテーブル内の1件のデータが変更された時に作成される

<img src="./img/DynamoDB-Stream_2.jpg" />

引用: [Amazon DynamoDB ストリームを使用して、順序付けされたデータをアプリケーション間でレプリケーションする方法](https://aws.amazon.com/jp/blogs/news/how-to-perform-ordered-data-replication-between-applications-by-using-amazon-dynamodb-streams/)

<br>
<br>

参考サイト

DynamoDB Stream 全般

- [DynamoDB StreamsとLambdaの話](https://qiita.com/bassaaaaa/items/7477420641080f922a59)

シャード数について

- [DynamoDB ストリームの Lambda IteratorAge メトリックスが増加しているのはなぜですか。](https://repost.aws/ja/knowledge-center/dynamodb-lambda-iteratorage#)

---

### 具体的な利用方法

---

### コスト