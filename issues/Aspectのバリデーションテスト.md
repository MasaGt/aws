### 事象

- S3 バケットのみで構成されるスタックに対して、S3 バケットのバージョニング設定をチェックする Aspect を設定した。その Aspect のバリデーションチェックをテストしようとしたところ想定した結果にならない

    - 想定する結果は、バリデーション処理に引っかかりエラーが投げられること

        <img src="../img/Issue-CDK-Validation-Test_1.svg" />

<br>

- 単純にバリデーション処理が間違っているかと思い、普通に cdk synth を実行した際もバリデーションに引っかからないかどうかをチェックすると、、、

    - 想定した通りの結果になっている (バリデーションチェックに引っかかる)

        <img src="../img/Issue-CDK-Validation-Test_2.svg" />

<br>

- Aspect の中に console.log でログを埋め込んでみるが、テストの実行時には表示されない

    <img src="../img/Issue-CDK-Validation-Test_3.svg" />

<br>

- ★つまり、テスト時に Aspect の処理が動いていない

---

### 原因

- App モジュール内でスタックに対して Aspect を設定していたから

    - テストコード内では App モジュールは使わず、新規に App モジュールを作成するので、 Apect の登録処理が動かない

        <img src="../img/Issue-CDK-Validation-Test_4.svg" />

---

### 解決策

- テストコードにて `Aspects.of(scope: IConstruct).add(aspect: IAspect)` を別途記述する必要がある

    <img src="../img/Issue-CDK-Validation-Test_5.svg" />

---

### 疑問

- なぜテストコードの中で自分で記述した bin 配下の App モジュールを実行しないのか? (以下の画像は AI の回答)

    <img src="../img/Issue-CDK-Validation-Test_6.svg" />

<br>

- 個人的に納得できたのは ④ の「 bin 配下のエントリーポイントをテストで実行してしまうと、特定のスタックだけではなく、CDK プロジェクトのすべてのスタック、コンストラクトが作成されてしまうのを避けたい」というのがしっくりきた