### CloudWatch とは

AWS サービスリソースを監視するサービスのこと

サービスリソースを監視する上でいくつかの機能がある
- アラート通知を行うCloudWatch Alarm

- ログの収集を行うCloudWatch Logs

- サービスのイベント（状態）をトリガーにアクションを実行するCloudWatch Events
    - 例: EC2が停止したらSlackにメッセージを飛ばす

<br>
<br>

参考サイト

[CloudWatchで出来ること、AWS監視のお作法とは クラウド運用管理](https://www.fujitsu.com/jp/products/software/resources/feature-stories/cloud-operation/aws-monitoring/)

[AWS CloudWatchとは？初心者でもわかる解説](https://www.future.ad.jp/futuremedia/keyword_cloudwatch/)

---

### 請求アラームの設定 ~ CloudWatch Alarm

請求アラートを作成するにはリージョンを $\color{red}米国東部 (バージニア北部)$ に設定する必要がある

\[手順\]

1. CloudWatchの管理画面に遷移する

    <img src="./img/CloudWatch-Billing-Alarm_1.png" />

<br>

2. サイドメニューから`アラーム` → `請求`をクリック

    *リージョンが米国東部 (バージニア北部)でないと表示されない

    <img src="./img/CloudWatch-Billing-Alarm_2.png" />

<br>

3. `アラームの作成`をクリックする

    <img src="./img/CloudWatch-Billing-Alarm_3.png" />

<br>

4. メトリクスと条件の指定を設定する

    - `メトリクスの選択`をクリック
    
        → $\color{red}「どのメトリクス(数値データ)に関するアラームを作成するか」$ というセクション

        *メトリクスとは → AWSリソースやアプリケーションのパフォーマンス、使用状況に関する数値データのこと

    <img src="./img/CloudWatch-Billing-Alarm_4.png" />

    <br>

    - 請求に関するアラームを作成するため、`請求`を選択する

    <img src="./img/CloudWatch-Billing-Alarm_5.png" />

    <br>

    - 今回は合計利用料金に関するアラームを作成するため`概算合計請求額`を選択する

    <img src="./img/CloudWatch-Billing-Alarm_6.png" />

    <br>

    - 通貨を選択して`メトリクスの選択`をクリック

    <img src="./img/CloudWatch-Billing-Alarm_7.png" />

    <br>

    - メトリクスの統計方法や計算間隔を設定する

    → $\color{red}「メトリクス値(データ)をどのように算出するか」$

    → また、 $\color{red}「アラームを送信するのはどのような条件か」$ というセクション

    - 統計: `最大`を選択し、計算間隔ごとに最大利用額を算出する

    - メトリクスの計算間隔: 6時間ごとにメトリクス(最大)を計算する

    <img src="./img/CloudWatch-Billing-Alarm_8.png" />

    <br>

    - アラートの条件を設定する

        - `しきい値の種類`
            - 静的: 一定のしきい値と条件を設定する
            - 異常検出: [異常検出の項目](#メトリクスの条件--異常検出とは)を参照

        - `EstimatedCharges が次の時...`: メトリクス(算出された値)がしきい値よりも $\color{red}どうなる$ とアラームを送るのか

        - `... よりも`: しきい値


    <img src="./img/CloudWatch-Billing-Alarm_9.png" />

    <br>

    - その他の設定

        - `アラームを実行するデータポイント`: 直近のメトリクス値のうち、何回しきい値を超えたらアラームを送るのかについての設定

            *データポイント=メトリクス値

        - `欠落データの処理`: メトリクス値が何らかの理由により得られなかった時の処理の仕方を指定

        <img src="./img/CloudWatch-Billing-Alarm-Missing-Data_1.png" />

        引用: [【AWS】CloudWatchアラームの「欠落データの処理」について理解する](https://makky12.hatenablog.com/entry/2022/12/19/120500)

    <img src="./img/CloudWatch-Billing-Alarm_10.png" />

<br>

5. アクションを設定する

    設定したしきい値に対して、とある条件が満たされたら $\color{red}どうするか$ を決めるセクション

    - 通知を設定する

        - `アラーム状態トリガー`
        
            - `アラーム状態`: 設定したしきい値を超えるとアラーム状態になる
            
            - `OK`: 設定した閾値を超えない場合はOK状態

            - `データ不足`: メトリクスが取得できなかった場合にデータ不足状態になる
            
                *`欠落データの処理`でMissing(欠落データを見つかりませんとして処理)を設定した場合のみ

        <br>

        - `次の SNS トピックに通知を送信`
        
            *SNSトピックについては[こちらを参照]()

    <img src="./img/CloudWatch-Billing-Alarm_11.png" />
    <img src="./img/CloudWatch-Billing-Alarm_12.png" />

<br>

6. 作成したアラームに名前と説明を設定する

    *トピック名とアラーム名は違う

    <img src="./img/CloudWatch-Billing-Alarm_13.png" />

<br>

7. 最後に、プレビューで各設定項目への設定値を確認し、正しければ`アラームの作成`をクリック

    <img src="./img/CloudWatch-Billing-Alarm_14.png" />
    <img src="./img/CloudWatch-Billing-Alarm_15.png" />
    <img src="./img/CloudWatch-Billing-Alarm_16.png" />





<br>
<br>

参考サイト

請求アラートの作成方法
- [【AWSを無料で使おう！】請求アラートの設定方法](https://note.alhinc.jp/n/ncb72772312e8)

- [CloudWatchで請求アラームを作成する](https://zenn.dev/mn87/articles/ec5a57228c491c)

- [初めてのAmazon CloudWatch設定｜AWS請求アラームの作成（2024年版）](https://qiita.com/FuruFuroof/items/7b4cf7b0e8c8244a36d8)

CloudWatch Alarm の各項目の詳しい説明
- [AWS CloudWatchアラームを設定してみた](https://zenn.dev/myatti/articles/a4d6333ea9edf9)

メトリクスの`統計`の意味
- [CloudWatch 統計定義](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html)

`アラームを実行するデータポイント`に関するわかりやすい説明
- [CloudWatch Alarmの設定項目がよく分からなかったので図にしてみた](https://zenn.dev/fdnsy/articles/be0017bdd02420)

`欠落データの処理`の各設定についてわかりやすい説明
- [【AWS】CloudWatchアラームの「欠落データの処理」について理解する](https://makky12.hatenablog.com/entry/2022/12/19/120500)


---

### 請求アラーム?アラート?

[請求アラート](./請求アラートの設定.md)

- AWS Billing and Cost Management から有効にする設定

- 請求アラートを有効にすると、請求アラームを作成できるようになる

<br>

[請求アラーム](#請求アラームの設定--cloudwatch-alarm)

- CloudWatch から作成するアラーム

<br>
<br>

参考サイト

[AWS】請求アラートと請求アラームの違い](https://zenn.dev/okaki_se/articles/5b5b69a3b215e5)

---

### メトリクスの条件 ~ 異常検出とは