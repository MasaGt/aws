### 擬似パラメータとは

- CloudFormation から提供される、テンプレート内で利用できる変数のこと

    - プログラミングでいう組み込み変数

<br>

- [Ref](./CloudFormation_組み込み関数.md#ref) や [Fn::Sub](./CloudFormation_組み込み関数.md#fnsub) の引数に擬似パラメータを指定することでそのパラメータに格納されている値を参照することができる

<br>

- 利用できる擬似パラメータは[こちら](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html)を参照

<br>
<br>

参考サイト

[【初心者向け】AWS CloudFormation 入門！完全ガイド](https://zenn.dev/issy/articles/zenn-cfn-overview#テンプレートで利用できる共通変数)

[擬似パラメータ参照](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html)