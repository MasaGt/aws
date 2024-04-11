### 事象

- IAM Identy Center にて作成したユーザーで、AWS のマネージドコンソールにログインできない

<img src="../img/issue_login_IAM_user.png" />

### 原因

- IAM と IAM Identity Center は異なるサービスであり、IAM Identity Center で作成したユーザーは IAM ユーザーではない

### 解決方法

- IAM Identity Center で作ったユーザーはアクセスポータル経由でしかログインできない。よって、直接 AWS マネージドコンソールにログインするのではなく<font color="red">アクセスポータルからログインする</font>