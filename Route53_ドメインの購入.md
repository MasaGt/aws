### Route53 でドメインの購入

1. マネージメントコンソールにて、Route53 の画面に遷移し、`ダッシュボード` を選択

    <img src="./img/Route53-Register-Domain_1.png" />

<br>

2. ダッシュボード画面にある `ドメインの登録` をクリック

    <img src="./img/Route53-Register-Domain_2.png" />

<br>

3. 購入するドメイン名を決める

    1. ドメインの検索にて、登録 (購入) したいドメイン名を入力する

    2. 検索結果にて、登録可能なドメインの中から登録したいドメイン名を選択する

    3. 選択されたドメインにて、選択したドメイン名を確認し、問題がなければ `チェックアウトに進む` をクリックする

    <img src="./img/Route53-Register-Domain_3.png" />

<br>

4. 購入オプションを選択する

    <img src="./img/Route53-Register-Domain_4.png" />

    <br>

    - ドメイン名

        - 前画面にて選択したドメイン名

    <br>

    - 期間

        - ドメインの利用期間

        - 1 ~ 10 年で選択できる

    <br>

    - 自動更新

        - ドメインの期限が来たら自動で更新させるかどうか

        - ドメインの更新は手動でもできる

<br>

5. 必要事項の記入

    <img src="./img/Route53-Register-Domain_5.png" />

    <br>

    - 必要事項を記入したら `次へ` をクリック

<br>

6. 購入ドメイン、記入項目の確認をしてドメインの購入をする

    <img src="./img/Route53-Register-Domain_6.png" />

    <br>

    - 最後の利用規約の項目にチェックを入れる

    - 表示されている情報に間違いがなければ `送信` をクリック

<br>

7. メールが届いたら完了

    - マネージドコンソールの Route53 画面のサイドメニューの `ドメイン → リクエスト` からも登録申請したドメインのステータスが見れる

        <img src="./img/Route53-Register-Domain_7.png" />

    <br>

    - マネージドコンソールの Route53 画面のサイドメニューの `ドメイン → 登録済みドメイン` から登録済みのドメインが見れる

        <img src="./img/Route53-Register-Domain_8.png" />

---

### ドメインの購入の際に起きた問題

#### 問題1: 電話番号が誤っているため、購入申請に失敗する

- ##### 原因

    <img src="./img/Route53-Register-Domain-Issue_1.png" />

    <br>

    - 電話番号が間違っていた

        - 国コードに次に入力する電話番号の先頭の0は省略する

<br>

- ##### 解決策

    - 電話番号を確認して、正しい番号を入力する

<br>

#### 問題2: 購入申請後に購入失敗のメールが届く

- ##### 原因

    - AWS 側から、自分のアカウントにドメインの購入制限がかけられていたっぽい

<br>

- ##### 解決策

    - 購入失敗メールに記載されているサポートにメールする

<br>
<br>

参考サイト

購入申請後に購入失敗のメールが届く問題について
- [Can't register new domain name using Route53](https://repost.aws/questions/QU0fAHnomBSdOtpUzOyjpeRQ/can-t-register-new-domain-name-using-route53)
- [[Resolved] Route53でドメインが登録できなかったのでAWSに問い合わせた](https://zenn.dev/jyama/articles/b57121044bfe4d)