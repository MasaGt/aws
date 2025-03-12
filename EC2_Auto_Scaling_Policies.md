### スケーリングポリシー

1. [手動スケーリング](#手動スケーリング)

2. [動的スケーリング](#動的なスケーリング)

3. [予測スケーリング](#予測スケーリング)

4. [スケジュールに基づくスケーリング](#スケジュールに基づくスケーリング)

<br>
<br>

参考サイト

[EC2 Auto Scaling スケーリングポリシーのまとめ](https://zenn.dev/taroman_zenn/articles/8a07d4e08f8219)

[Auto Scalingの段階スケーリングポリシーについて](https://dev.classmethod.jp/articles/auto-scaling-steps/)

[【AWS初学者向け・図解】EC2 AutoScalingとは？現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-ec2-autoscaling-beginner)

---

### 手動スケーリング

- その名の通り、手動でインスタンスの増減を行いスケーリングポリシー

- [Auto Scaling Group の「希望する数」](./EC2_AutoScaling.md#ec2-auto-scaling-をより理解するための用語) = 稼働させる EC2 インスタンスの数を手動で変更するポリシーのイメージ

<br>
<br>

参考サイト

[EC2 Auto Scaling スケーリングポリシーのまとめ](https://zenn.dev/taroman_zenn/articles/8a07d4e08f8219)

---

### 動的なスケーリング

#### ターゲット追跡ポリシー

- **CloudWatch メトリクス**の値によって EC2 インスタンスを増減するポリシー

    -  例: 平均 CPU 使用率を 70% に維持するようにターゲットの値 (=メトリクスの値) を設定

        - 平均 CPU 使用率が 70% を超えそうになるとスケールアウト

        -  平均 CPU 使用率が 70% を下回りそうになるとスケールイン

<br>

#### シンプルスケーリングポリシー

- [ステップスケーリングポリシー](#ステップスケーリングポリシー)の前身のようなスケーリングポリシー

    - ほぼほぼ使うことはない。ステップスケーリングポリシーで出来てシンプルスケーリングポリシーで出来ないことは基本的に無いのでこのポリシーについての説明は省略

<br>

#### ステップスケーリングポリシー

- **CloudWatch アラーム**の状態に基づいて EC2 インスタンスの数を増減させるスケーリングポリシー

<br>

#### ターゲット追跡スケーリングポリシーとステップスケーリングポリシーの違い

- ターゲット追跡スケーリングポリシーでは **CloudWatch メトリクス**を判断材料にし、テップスケーリングポリシーでは **CloudWatch アラーム**を判断材料にして EC2 インスタンスをスケーリングする

<br>
<br>

参考サイト

[EC2 Auto Scaling スケーリングポリシーのまとめ](https://zenn.dev/taroman_zenn/articles/8a07d4e08f8219)

[Auto Scalingの段階スケーリングポリシーについて](https://dev.classmethod.jp/articles/auto-scaling-steps/)

[【AWS初学者向け・図解】EC2 AutoScalingとは？現役エンジニアがわかりやすく解説](https://o2mamiblog.com/aws-ec2-autoscaling-beginner)

---

### 予測スケーリング

- 機械学習を利用して CloudWatch の履歴データに基づき、トラフィック変動の発生を予測して適正な数の EC2 インスタンスを増減させるスケーリングポリシー

<br>
<br>

参考サイト

[EC2 Auto Scaling スケーリングポリシーのまとめ](https://zenn.dev/taroman_zenn/articles/8a07d4e08f8219)

[【アップデート】Amazon EC2 Auto Scaling の予測頻度がさらに高く正確に](https://www.sunnycloud.jp/column/20230123-01/)

---

### スケジュールに基づくスケーリング

- 日時を指定してインスタンスの数を増減させるスケーリングポリシー

    - アクセスの増減が前もってわかっているケースに使える

<br>
<br>

参考サイト

[EC2 Auto Scaling スケーリングポリシーのまとめ](https://zenn.dev/taroman_zenn/articles/8a07d4e08f8219)
