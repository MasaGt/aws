### SQS とは

- Simple Queue Service の略

- フルマネージドなメッセージングキューイングサービス

    - 異なるシステムやプロセス間でメッセージを一時的に格納し、送受信するための技術やサービス

- SQS はリージョンサービス

<br>

#### SQS を利用するメリット

    - メッセージの送信側と受信側のアプリケーションを疎結合にすることで、

<br>
<br>

参考サイト

[メッセージキューとは？いまさら聞けないメリット・デメリット](https://www.alibabacloud.com/help/ja/cloud-migration-guide-for-beginners/latest/messagequeue)

[メッセージキュー AWS クラウドジョブをバッチ処理してアプリケーションを分離するための非同期メッセージング](https://aws.amazon.com/jp/message-queue/)

[アプリケーション間連携を疎結合で実現。「Amazon SQS」をグラレコで解説](https://aws.amazon.com/jp/builders-flash/202105/awsgeek-sqs/?awsf.filter-name=*all)

---

### SQS での重要なコンセプト

<img src="./img/SQS-Concept_1.png" />

引用: [【初心者向け】Amazon Simple Queue Service (SQS) 入門！完全ガイド](https://zenn.dev/issy/articles/zenn-sqs-overview)

<br>

#### プロデューサー (Producer)

- メッセージの発行元

<br>

#### コンシューマー (Consumer)

- SQS からメッセージを取得するアプリケーション

- ★コンシューマーが自分でキューにポーリング (一定間隔でデータ有無を確認) する **Pull 型** の仕組み

    - ポーリングには以下の2種類がある

        1. ショートポーリング

            - デフォルトのポーリング方法

            - コンシューマーからのポーリングの際に、キューの中のメッセージの有無に関わらず即座にレスポンスが返される

                - キューにメッセージがない場合、**即座に**空のレスポンスが返却される

        <br>

        2. ロングポーリング

            - キュー内のメッセージが空の場合はメッセージがキューに到達するか設定した待機時間まで経過するまでレスポンスは返却されない

                - 待機時間中もメッセージが無い場合は、空のレスポンスが返却される
            
            - キューへの問い合わせ回数を抑えることができるため、コスト削減にもつながる

            - AWS ではロングポーリングを設定することが推奨されている

#### メッセージ

- プロデューサーが送信するデータ

    - キューに保管される

    - コンシューマーがキューから取得する

#### キュー

- メッセージの保管場所

<br>
<br>

参考サイト

SQS の構成要素について
- [【初心者向け】Amazon Simple Queue Service (SQS) 入門！完全ガイド](https://zenn.dev/issy/articles/zenn-sqs-overview#sqs-とは)

ポーリングの種類について

- [【初心者向け】Amazon SQS ショートポーリングとロングポーリングをわかりやすく解説](https://kazuqueue-tech.com/difference-short-long-polling/)
- [【初心者でも5分で分かる】Amazon SQS](https://asa3-cloud.com/【初心者でも5分で分かる】amazon-sqs/)

---

### メッセージ配信の仕組み

<br>
<br>

参考サイト

[Amazon SQS による分散キュー](https://dev.classmethod.jp/articles/amazon-sqs-queue-service/)

---

### キューの種類

#### スタンダードキュー(標準キュー)

<img src="./img/Lambda-Standard-Queue_1.png" />

<br>

- メッセージが送信された順番で配信しようするが、必ずしも順番通りになるとは限らない = ベストエフォート順序

- 複数のコンシューマーによってメッセージが取得される時、同じメッセージが重複して取得される時がある
    - [冪等性]()を担保する必要がある場合は、スタンダードキューの代わりに [FIFO キュー](#fifo-キュー) を使用したり、コンシューマー側で重複メッセージを受信した場合の処理を設定する必要がある


- 高スループット
    - = 1秒間にスタンダードキューへのメッセージ送信、メッセージ取得、メッセージ削除のAPIを無制限に叩ける

- スタンダードキューの主な用途

    - 順番が重要ではなかったり、重複を許容するアプリケーション間でのメッセージングキュー

<br>

#### FIFO キュー

<img src="./img/Lambda-FIFO-Queue_1.png" />

<br>

- メッセージは**(基本的には)**送信された順番に取得される

- メッセージは**(基本的には)**重複して取得されることはない

- ★スループットに制限がある
    - 1秒間に FIFO キューへのメッセージ送信、メッセージ取得、メッセージ削除のAPIはそれぞれ300回まで叩ける

    - FIFO には高スループットモードがあり、リージョンによって1秒間に最大 18,000 (or 9,000 or 4,500 or 2,400) 回のAPIコールが可能

<br>
<br>

参考サイト

[新機能】Amazon SQSにFIFOが追加されました！（重複削除/単一実行/順序取得に対応）](https://dev.classmethod.jp/articles/sqs-new-fifo/)

[Amazon SQS と処理の重複 前編 ~ 可視性タイムアウトの役割](https://aws.amazon.com/jp/builders-flash/202401/sqs-process-duplication/)

[Amazon SQS と処理の重複 後編 ~ FIFO キューの特徴]()https://aws.amazon.com/jp/builders-flash/202403/sqs-process-duplication-2/

[SQSのクオータが分かりにくい](https://zenn.dev/kiitosu/articles/3e50f22df039da)

[Amazon SQS が FIFO 高スループットモードのスループットクォータの引き上げを発表](https://aws.amazon.com/jp/about-aws/whats-new/2023/10/amazon-sqs-increased-throughput-quota-fifo-high-throughput-mode/)

---

### SQS の主要機能

#### デッドレターキュー

<br>

#### 可視性タイムアウト (Visibility Timeout)

<br>

#### 遅延キュー (Delay Seconds)

---

### メッセージの重複

---

### コスト