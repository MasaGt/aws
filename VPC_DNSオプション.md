### DNS解決を有効化

- DNS 解決を有効化すると、VPC にてデフォルトの [Route53 Resolver](./Route53Resolver.md) (フォワーダー + キャッシュ DNS サーバー)を利用する

- DNS 解決を有効化しないとドメイン名の解決ができず、対象の VPC に作成した EC2 などで [dnf コマンドの失敗](./issues/EC2でdnfコマンドが失敗する.md)などの問題が発生する

---

### DNS ホスト名を有効化

- DNS ホスト名を有効化すると、VPC 内で起動されるインスタンスにパブリック [DNS ホスト名](#dns-ホスト名)を自動で割り当てる

<br>

#### DNS ホスト名

- ホスト名とドメイン名で構成されるインスタンスを一意に一意に特定する名前

- 例: DNS ホスト名が有効な VPC で EC2 インスタンスを起動すると、グローバル IP だけではなく、DNS ホスト名でもその EC2 にアクセスできるようになる

<br>
<br>

参考サイト

[VPCのDNS解決とDNSホスト名の関係性について検証してみた](https://blog.serverworks.co.jp/2023/05/02/175854)

[VPC の DNS 属性の影響](https://zenn.dev/furururu02/articles/c545f1bb06f6e9)

[VPC 「DNSホスト名」の有効化とは](https://qiita.com/satofujino/items/a8f3106dbd5557097ad6)