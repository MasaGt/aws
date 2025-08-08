### 事象

- CDK で Lambda 関数を作成~デプロイした

- マネージメントコンソールからテストを実行したところ、以下のエラーが発生した

    - Runtime.HandlerNotFound

        <img src="../img/issue-cdk-lambda-handler_1.png" />

---

### 原因

- Lambda 関数コンストラクト (L2) で指定したハンドラ関数の名前が間違っていた

    <img src="../img/issue-cdk-lambda-handler_2.svg" />

---

### 解決策

- Lambda 関数コンストラクトのハンドラー関数を指定している箇所を以下のように修正

    - × hander
    - ○ handler

        <img src="../img/issue-cdk-lambda-handler_3.svg" />