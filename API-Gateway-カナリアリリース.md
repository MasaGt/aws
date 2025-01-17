### カナリアリリース

#### イメージ

- canary (カナリアリリース) を作成すると対象のステージに紐づいた特別な canary ステージが作成されるイメージ

    <img src="./img/API-Gateway-Canary_2.png" />

<br>

- 対象ステージに canary を作成したら、以降の対象ステージへの API デプロイは canary ステージへのデプロイになる

    <img src="./img/API-Gateway-Canary-Deploy_1.png" />


<br>
<br>

参考サイト

[API Gatewayの耐障害性を考える](https://zenn.dev/tech4anyone/articles/167873880acc7e#api-gatewayのカナリアリリース)

---

### 練習

#### 前準備

1. Lambda にて以下のように自身のバージョンを表示する簡単な関数を用意する

    - body での表示するバージョンだけ変えて新しくバージョンを発行し、バージョンによって返ってくるメッセージのバージョン部分が異なるようにする

        - バージョン1

           <img src="./img/Canary-Deploy-Prep_1.png" />

        <br>

        - バージョン2

           <img src="./img/Canary-Deploy-Prep_2.png" />

<br>

2. API Gateway にて REST API を作成

    - 適当なリソースを作成し、そのリソースにGETメソッドで上記 Lambda 関数のバージョン1を呼び出すように設定し、デプロイする

        <img src="./img/Canary-Deploy-Prep_3.png" />

    <br>

    - ちゃんとエンドポイントからレスポンスが返ってくることを確認

        <img src="./img/Canary-Deploy-Prep_4.png" />

<br>

#### カナリアリリース練習

1. 対象のステージの Canaryタブにて、 `canaryの作成`をクリックする

    <img src="./img/Canary-Deploy-Prac_1.png" />

<br>

2. 各項目を設定し、`canaryを作成` をクリック

    <img src="./img/Canary-Deploy-Prac_2.png" />

    - canary の設定

        - `配信をリクエスト`

            - canary: 作成する canaryへリクエストを割りふる割合

            - 現在のステージ: 現在のステージへリクエストを割り振る割合

        <br>

        - `ステージをキャッシュ`

            - 現在のステージと作成する canary ステージではキャッシュは共有されないため、canary ステージ用にレスポンスをキャッシュするかどうかの設定項目

    <br>

    - `canary ステージ変数`

        - 現在のステージ変数を canary ステージ用にオーバーライドするかどうかの設定項目

<br>

3. 呼び出す関数をバージョン2の Lambda 関数に変更してデプロイする


    <img src="./img/Canary-Deploy-Prac_3.png" />

    <img src="./img/Canary-Deploy-Prac_4.png" />

    <br>

    - これでカナリアリリースでのデプロイ完了

<br>

#### カナリアリリース後の確認

- Postman でエンドポイントにGETリクエストを何回か送ってみる

    - 以下のように半々の確率でバージョン1かバージョン2の Lambda 関数のレスポンスが確認できれば

    <img src="./img/Canary-Deploy-Check_1.png" />
    <img src="./img/Canary-Deploy-Check_2.png" />

<br>

#### カナリアリリースを本番に昇格させる

- 新しい API (canary ステージへデプロイした API) に問題がなければ、 canary を本番に差し替える必要が出てくる

#### 手順

1. canary を設定したステージの Canary タブにて、`canary を昇格させる` をクリック

    <img src="./img/Canary-Deploy-Release_1.png" />

<br>

2. 適用したい項目にチェックをいれ `canary を昇格させる` をクリック

    <img src="./img/Canary-Deploy-Release_2.png" />

    - `canary のデプロイでステージを更新`

        - canary ステージにデプロイされている API を現在のステージに適用するかどうか
    
    <br>

    - `canary の変数でステージを更新`

        - canary ステージでオーバーライドしている変数を現在のステージに適用するかどうか

    <br>

    - `canary の割合を 0.0 % に設定`

        - canary のリクエスト振り分けの設定について、 canary ステージへのリクエストの振り分け率を 0% に更新するかどうか

<br>

3. カナリアリリースの設定がもう必要なけば、Canary タブにて `削除` をクリックして canary 設定を削除する

    <img src="./img/Canary-Deploy-Release_3.png" />

---

### カナリアリリースでの注意点

- 新しくエンドポイントを追加するようなケースの時はカナリアリリースでのデプロイはできない

    <img src="./img/API-Gateway-Canary-Issue_1.png" />