### 目的

- 1つの CDK プロジェクトに 2つの App モジュール (app-1.tx, app-2.ts) を作成することができるかどうかの実験

---

### 確認方法

- app-1.ts をエントリーポイントに指定したい場合

    1. --app オプションで指定する

        ```bash
        #デフォルトプロファイルが無い or 任意のプロファイルを利用したい場合 --profile を利用する
        npx aws-cdk synth --app "npx ts-node --prefer-ts-exts bin/app-1.ts" --profile <プロファイル>
        ```

        or

    2. cdk.json の app に指定する

        ```json
        #cdk.json
        {
            "app": "npx ts-node --prefer-ts-exts bin/app-1.ts"
        }
        ```

<br>

- app-2.ts をエントリーポイントに指定したい場合

    - 上記の --app オプションでの指定 or cdk.json での指定方法の app-1.ts を app-2.ts に書き換えるだけ

---

### cdk.json の app と --app オプションの両方が指定されている場合

- --app オプションが優先される

    ```json
    #cdk.json
    {
        "app": "npx ts-node --prefer-ts-exts bin/app-1.ts"
    }
    ```

    ```bash
    npx aws-cdk synth --app "npx ts-node --prefer-ts-exts bin/app-2.ts" --profile <プロファイル>
    ```

    <br>

    → app-2.ts をエントリーポイントとして CloudAssembly を構築する

---

### おまけ

- app オプションに指定する `npx ts-node ~~` にて `--prefer-ts-exts` オプションはなくてもいい

    ```json
    #cdk.json
    {
        "app": "npx ts-node bin/app-1.ts"
    }
    ```

    ```bash
    npx aws-cdk synth --app "npx ts-node bin/app-1.ts" --profile <プロファイル>
    ```