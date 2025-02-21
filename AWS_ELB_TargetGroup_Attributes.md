### TargetGroup の 属性 (Attributes) とは

- ★[TargetGroup の作成](./AWS_ELB_TargetGroup.md)時には設定できない

    - (必要に応じて) TargetGroup の作成後に編集する必要がある

<br>

- ざっくりと以下の項目などについての設定ができる

    - ターゲットグループに対してのリクエストを振り分けるアルゴリズム

    - [スティッキーセッション](./AWS_ELB.md#スティッキーセッション)の有効/無効化

    - ターゲットグループを正常とみなす要件

    - ターゲットグループが異常とみなされた場合の挙動

---

### TargetGroup の属性を編集する

1. マネージドコンソールにログイン後、EC2 画面に遷移し、サイドメニューにある `ターゲットグループ`を クリック

<br>

2. 属性を編集したいターゲットグループを選択し、アクションから `ターゲットグループ属性を編集` をクリック。もしくは、画面下部の属性タブを開き `編集` をクリックする

    <img src="./img/ELB_TargetGroup-Attributes_1.png" />

<br>

3. 各項目を設定し、`変更内容の保存` をクリックする

    <img src="./img/ELB_TargetGroup-Attributes_2.png" />

    <br>

    - `登録解除の遅延 (ストリーミング間隔)`
        - ターゲットグループからターゲットを登録解除する際に、実際に登録解除するまでの待ち時間

        - 詳しくは[こちら](#登録解除の遅延について)を参照

    <br>

    - `ロードバランシングアルゴリズム`

        - ELB がターゲットにリクエストを割り振るアルゴリズム

        - `ラウンドロビン`

            - リクエストを順番に均等に振り分ける方法

                <img src="./img/ELB_TargetGroup-Attributes-Algorithms_1.png">

                引用: [ロードバランサー（LB）とは？仕組みやDNSラウンドロビンとの違いについて解説](https://www.rworks.jp/system/system-column/sys-entry/16305/)

            <br>

        - `最小の未処理のリクエスト`

            - **未処理のリクエスト数が最も少ないターゲット**にリクエストを割り振る方法

            <br>

        - `加重ランダム`

            - ターゲットグループ内の正常なターゲットにリクエストを**均等に、ランダムな順序**で振り分ける方法

    <br>

    - `スロースタート期間`

        - 新しく登録されたターゲットに、リクエストを送信し始めるまでの猶予期間のこと

        - 詳しくは[こちら](#スロースタート期間)を参照

    <br>

    <img src="./img/ELB_TargetGroup-Attributes_3.png" />

    <br>

    - `維持設定`

        - スティッキーセッションの有効/無効の設定

        <img src="./img/ELB_TargetGroup-Attributes_6.png" />

        <br>


        - `維持設定のタイプ`

            - ロードバランサーが Cookie を生成しました

                - 同一ユーザーの判断を ALB 側で自動で生成する Cookie の値で判断する

                <img src="./img/ALB-Sticky-Session_1.png" />

                引用: [【基礎から学ぶ】ELBのスティッキーセッションについてまとめてみた](https://blog.serverworks.co.jp/tech/2017/01/05/elb-sticky)

            <br>

            - アプリケーションベースの Cookie

                - 同一ユーザーの判断をアプリケーション側で付与する Cookie の値で判断する

                <img src="./img/ALB-Sticky-Session_2.png" />

                引用: [【基礎から学ぶ】ELBのスティッキーセッションについてまとめてみた](https://blog.serverworks.co.jp/tech/2017/01/05/elb-sticky)

                <br>

                - アプリケーション側で付与する Cookie を使う場合、以下の画像のように ALB 側の維持設定の項目にて Cookie 名を事前に設定する必要がある

                <img src="./img/ELB_TargetGroup-Attributes_7.png" />

        <br>

        - `維持設定の期間`

            - スティッキーセッションの有効期限 = Cookie の有効期限

    <br>

    - `クロスゾーン負荷分散`

        - 
    
    <br>

    <img src="./img/ELB_TargetGroup-Attributes_4.png" />

    <br>

    - 設定タイプ

        - `統合設定`

        - `正常状態の要件`

        - `最初限の正常なターゲットパーセンテージ`


    <br>

    <img src="./img/ELB_TargetGroup-Attributes_5.png" />

    <br>

    - 設定タイプ

        - `詳細設定`

        <br>

        - DNS - 正常状態の要件

            - `最小限の正常なターゲット数`

            <br>

            - `最初限の正常なターゲットパーセンテージ`

        <br>

        - ルーティング - 正常状態の要件

            - `最小限の正常なターゲット数`

            - `最小限の正常なターゲットパーセンテージ`

<br>
<br>

参考サイト

設定項目全般について

- [【初心者向け】Application Load Balancer（ALB）とターゲットグループの属性についてまとめてみた](https://blog.serverworks.co.jp/2023/04/13/115851#ターゲットグループの属性とは)
- [Application Load Balancer のターゲットグループ属性を編集する](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/edit-target-group-attributes.html)

<br>

加重ランダムについて
- [Application Load Balancer のターゲットグループ](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/load-balancer-target-groups.html#modify-routing-algorithm)

---

### 登録解除の遅延について

- ターゲットをターゲットグループから登録解除するまでの遅延時間

    - 遅延時間の間に、登録解除対象のターゲットへのリクエストを全て済ませてしまうのが目的

<br>

- ★ターゲットをターゲットグループから登録解除する際に、そのターゲットへの未処理のリクエストがなければ、登録解除の遅延を待たずにすぐ登録解除を行う

<br>

<img src="./img/ELB_TargetGroup-Attributes-Deregistration-In-Progress_1.png" />

<br>
<br>

参考サイト

[AWS ALBのターゲットグループの登録解除の遅延は本当に遅延しているのか](https://qiita.com/rentama/items/1da1dbc882ce068eb882)

[Load Balancerの仕組み、構成](https://qiita.com/s_yanada/items/111c709b1362313dfebc#登録解除の遅延)

[[AWS Black Belt Online Seminar] Elastic Load Balancing (ELB)](https://d1.awsstatic.com/webinars/jp/pdf/services/20191029_AWS-Blackbelt_ELB.pdf)

---

### スロースタート期間

- 通常 ELB はターゲットへのヘルスチェックが成功した直後にリクエストを振り分ける (= スロースタート期間 0秒)

- スロースタート期間を設けることで、ELB はターゲットへのヘルスチェックが成功した後に設定された期間リクエストの振り分けを待つ


<img src="./img/ELB-Slow-Start_1.png" />

<br>
<br>

参考サイト

スロースタート期間について
- [【AWSチュートリアル】WEBサーバ用のALBを作成してみよう！](https://study-infra.com/aws-web-alb-02/#toc10)

ELB のヘルスチェックについて
- [ELBとRoute 53のヘルスチェック仕様の違い](https://dev.classmethod.jp/articles/health-check-spec-elb-route53/)

---

### 維持設定 (スティッキーセッション)

- ★★★ALB (+ CLB) と ELB のスティッキーセッションでは、同一ユーザー判定に利用されるものが違う★★★

#### ALB と CLB

- Cookie を利用して同一ユーザーの判断を行う

    - ALB によって自動で作成される Cookie

    - 接続先アプリケーションが付与する Cookie

    - ★Cookie なので違うブラウザからのアクセスの場合、接続先が異なる可能性がある

<br>

#### NLB

- 送信元 IP アドレスを利用して同一ユーザーの判断を行う

- ★[NAT や NAPT](https://github.com/MasaGt/CS/blob/eaaffa7d88a060f46c64a74b951105fe05d4eb6d/NAT-NAPT.md) を利用したリクエストの場合、全てのリクエストが1つの接続先に偏るので注意

<br>

#### ステッキーセッションの有効期間

##### ALB

- 維持設定の期間 (Cookie の有効期限) はリクエストごとに Cookie の有効期限がリセットされる

- よって、最終アクセスから維持設定の期間が経過すると、スティッキーセッションは一旦終了する

<img src="./img/ALB-Sticky-Session_3.png" />

<br>

##### CLB

- **ALB と異なり**、維持設定の期間 (Cookie の有効期限) はリクエストごとに Cookie の有効期限がリセット**されない**

- よって、最初のアクセスから維持設定の期間が経過すると、スティッキーセッションは一旦終了する

<img src="./img/CLB-Sticky-Session_1.png" />

<br>

#### NLB

<img src="./img/NLB-Sticky-Session_1.png" />

- 明確な有効期限はない

- ターゲットのヘルスチェックの状態が更新されたり、ターゲットグループに対してターゲットの登録や解除を行うことでスティッキーセッションがリセットされることがある

    - 上記のようなリセットがなければ、同一 IP からのリクエストはずっと固定接続先に振り分けられる 

<br>
<br>

参考サイト

[【基礎から学ぶ】ELBのスティッキーセッションについてまとめてみた](https://blog.serverworks.co.jp/tech/2017/01/05/elb-sticky)

[AWS Black Belt Online Seminar Elastic Load Balancing](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2023_Elastic-Load-Balancing_0525_v1.pdf)

[ALBのスティッキーセッションの仕様について教えてください。](https://dev.classmethod.jp/articles/tsnote-alb-sticky-session-specification/)

[Network Load Balancer(NLB)のスティッキーセッション維持期間はどのくらいですか?](https://support.serverworks.co.jp/hc/ja/articles/5884706664473-Network-Load-Balancer-NLB-のスティッキーセッション維持期間はどのくらいですか)

[AWSのロードバランサーのスティッキーセッションの仕組み](https://techblog.techfirm.co.jp/entry/knowledge-about-elb-stickysession)

---

### クロスゾーン負荷分散

#### ELB \~ 複数 AZ 配置の実態

- ELB を複数 AZ に配置すると、各々の AZ に ELB の実態としての ENI が作成される
    
    <img src="./img/ELB-Multi-AZ_1.png" />

<br>

#### クロスゾーン負荷分散がオフの場合

- リクエストを受けた ELB は、**自身が属している AZ に配置されたターゲット**にリクエストを割り振る

    <img src="./img/ELB-Cross-Zone-Load-Balancing_1.png" />

<br>

- 各 ELB ノードと同一 AZ にあるターゲット数がそれぞれ異なっている場合には以下のようにトラフィックが偏ってしまう
    
    <img src="./img/ELB-Cross-Zone-Load-Balancing_2.png" />

<br>

#### クロスゾーン負荷分散がオンの場合

- 各 ELB ノードは **AZ を跨いで全てのターゲット**にリクエストを割り振る

    <img src="./img/ELB-Cross-Zone-Load-Balancing_3.png" />

<br>

#### 重要なポイント

- ALB

    - デフォルトでクロスゾーン負荷分散がON

        - ★ELB ノードとターゲット間の AZ を跨いだデータ転送料はかからない

<br>

- NLB

    - デフォルトでクロスゾーン負荷分散は**OFF**

        - ★クロスゾーン負荷分散を ON にした時の AZ を跨いだデータ転送料が発生する

<br>

- GLB

    - デフォルトでクロスゾーン負荷分散は**OFF**

        - ★クロスゾーン負荷分散を ON にした時の AZ を跨いだデータ転送料が発生する

<br>
<br>

参考サイト

クロスゾーン負荷分散について
- [AWS Black Belt Online Seminar Elastic Load Balancing](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2023_Elastic-Load-Balancing_0525_v1.pdf)

ELB の各サービスのデフォルトでのクロスゾーン負荷分散の ON / OFF について
- [ELBの種類によるクロスゾーン負荷分散のデフォルト値調べ](https://dev.classmethod.jp/articles/elb_crosszone_load_balancing_default_value)

クロスゾーン負荷分散について、および AZ を跨いだデータ転送料について
- [【初心者向け】Elastic Load Balancing(ELB) 入門！完全ガイド](https://zenn.dev/issy/articles/zenn-elb-overview#クロスゾーン負荷分散)