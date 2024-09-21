### パブリックサブネットのサーバーからプライベートサブネッへのサーバーへ接続

ポイント
- パブリックサブネットのサーバーからプライベートサブネットのサーバーへSSHで接続を行う

- パブリック → プライベート の際に、公開鍵が必要になる
    - [ssh-agent](#ssh-agent-とは) を利用するか、[~/.ssh/config](#sshconfig-とは) を記述するなどの方法で解決できる

---

### ssh-agent でパブリック → プライベートに接続する方法

1. ssh-agent に**プライベートサブネットの EC2 インスタンスの接続に必要な秘密鍵**を登録する

    ```bash
    ssh-add [秘密鍵のパス]
    ```

<br>

2. ssh コマンドでパブリックサブネットの EC2 インスタンスに接続する

    *-A: ssh-agent に登録した秘密鍵を接続先サーバーでも利用できるにするオプション

    ```bash
    ssh -A -i [パブリックEC2インスタンスの秘密鍵のパス] ユーザー名@IPアドレス
    ```

<br>

3. パブリックサブネットの EC2 インスタンスに接続後、ssh コマンドでプライベートサブネットの EC2 インスタンスに接続する

    ```bash
    ssh ユーザー名@IPアドレス
    ```

---

### ~/.ssh/config でパブリック → プライベートに接続する方法

1. ~/.ssh 配下に config というファイルを作成する

<br>

2. 以下のように config ファイルに記述する

    - ProxyJump: 経由するマシンのユーザー名、ポート番号は省略可能

    ```
    ## HostnameはパブリックEC2インスタンスのパブリックIP
    Host public
        Hostname xxx.xxx.xxx.xxx
        User ec2-user
        IdentityFile ~/.ssh/~~~.pem

    ## HostnameはプライベートEC2インスタンスのプライベートIP
    Host private
        Hostname yyy.yyy.yyy.yyy
        User ec2-user
        IdentityFile ~/.ssh/~~~.pem
        ProxyJump public
    ```

<br>

3. ssh コマンドで**プライベートEC2インスタンスに接続する**

    ```bash
    ssh private
    ```

<br>
<br>

参考サイト

[踏み台サーバ経由の多段SSH接続をローカル端末の秘密鍵のみで実施する](https://dev.classmethod.jp/articles/bastion-multi-stage-ssh-only-local-pem/)

[多段 ssh するなら ProxyCommand じゃなくて ProxyJump を使おう](https://zenn.dev/kariya_mitsuru/articles/ed76b4b27ac0fc)

---

### ssh-agent とは

- ssh-agent とは
    - ssh 接続時の鍵情報を登録&利用することができるサービス


- OS をシステム終了するとssh-agent の登録情報が削除されるので、OS を起動する度に再登録が必要

- 基本コマンド

    - クライアント側で秘密鍵の登録
        ```bash
        ssh-add [秘密鍵のパス]
        ```

    - 登録されている秘密鍵の削除
        ```bash
        ssh-add -d [秘密鍵のパス]
        ```

    - 登録されている全ての秘密鍵の削除
        ```bash
        ssh-add -D
        ```

    - 登録されている鍵の一覧

        *鍵のパスも表示されるので、削除したい鍵のパスもこのコマンドで確認できる

        ```bash
        ssh-add -l
        ```

<br>
<br>

参考サイト
[【SSH】ssh-agentの使い方を整理する](https://qiita.com/Yarimizu14/items/6a4bab703d67ea766ddc)

---

### .ssh/config とは

- .ssh 配下に置く config とは SSH クライアント用の設定ファイル
    - 設定ファイルに接続先および接続情報を記述しておくことで SSH 接続の際にその情報を省略することができる

- config は拡張子のないファイル

- 以下は基本的な書き方
    ```
    ## コメント

    Host <接続先名(自分で好きなものを決めていい)>
        Hostname <接続先サーバのホスト名 or IP>
        User <ユーザー名>
        IdentityFile <SSH接続に使う秘密鍵のパス>
        (Port <ポート番号>)
        (ProxyCommand <sshコマンド>)
        (ProxyJump <踏み台ホストのユーザ名@踏み台ホストのホスト名:踏み台ホストのポート番号>)
    ```

<br>
<br>

参考サイト

[~/.ssh/configを使ってSSH接続を楽にする](https://tech-blog.rakus.co.jp/entry/20210512/ssh)
