### Lambda 関数を ECR にあるコンテナイメージから作成する

- 基本的なコンテナイメージから Lambda 関数を作成する方法は[こちら]()を参照

<br>

- ★AWS マネージドコンソールから作成する場合、**マルチプラットフォームイメージ** でも **provenance 情報を含んだイメージ** でも Lambda 関数を作成することは可能

    - 作成時に **Image Manifest のURI** を指定することがポイント
        <img src="./img/Lambda-From-Container-Image-with-Provenance_1.svg" />

    <br>

    - 誤って Image Index や Attestation Manifest から Lambda 関数を作成しようとするとエラーで作成できない

        <img src="./img/Lambda-From-Container-Image-with-Provenance_2.svg" />

<br>

- ★★Lambda 関数を AWS CloudFormation から作成する場合も、マルチプラットフォームイメージおよび provenance 情報を含んだイメージ から Lambda 関数を作成することも可能

    <img src="./img/Lambda-From-Container-Image-with-Provenance_3.svg" />

<br>

- イメージタグから Lambda 関数を作成する場合は provenance 情報をイメージに含めないようにビルドしたり、シングルプラットフォームビルドしないといけないっぽい

<br>
<br>

参考サイト

[ECRにイメージが複数作成されてしまい、Lambdaにデプロイできない問題](https://qiita.com/har1101/items/40717ac600559a6cb1bb#provenanceオプションとは)