### IAM Identity Center とは

かつて AWS Signle Sign-On だったサービスがアップデートして名前が変わったもの

~~複数の IAM ユーザーとグループをここで一括で管理できるようになる~~  
-> <font color="red">**IAM ユーザーと IAM identity center で作成するユーザーは違うもの**</font>

<font color="red">そもそも、IAM と IAM Identity Center は違うサービス (各ユーザーに異なるレベルのアクセス権限を付与する点は一緒)</font>

他のサービスからログインしたら、同じアカウントで AWS にもログインできるようにする Single Sign-On を利用できるようにする機能もある

<img src="./img/IAM Identity Center.png" />

---

### IAM Identity Centerの利用方法

<br>

1\. Organizations を設定する

今回は アカウント1 と アカウント2 の 2 つのアカウントを同じOrganizations に所属させている  
(アカウント2 が management account)

<img src="./img/IAM Identity Center2.png" />

<br>

2\. management account のアカウント2で Iam Identity Center を enable する

<img src="./img/IAM Identity Center3.png" />

<br>

3\. ユーザーやグループを作成する

user1を作成し、Adminsグループに所属させた

<img src="./img/IAM Identity Center4.png" />
<img src="./img/IAM Identity Center5.png" />

<br>

4\. IAM Identity center の Multi-accuont permission の Permission Sets から許可セット(アクセス権限)を作成する

<img src="./img/IAM Identity Center6.png" />

<br>

5\. Multi-accuont permission の AWS accounts から **"どのアカウントに"** 、 **"どのユーザー/グループを"** 、 **"どの許可セット"** で割り当てるかを設定する

<img src="./img/IAM Identity Center7.png" />
<img src="./img/IAM Identity Center8.png" />

<br>

6\. 以降は IAM Identity Center に表示されている Access portal からアクセスすることでアカウントの切り替えやアクセス権限の切り替えなどが簡単にできる

<img src="./img/IAM Identity Center9.png" />

---

### 複数アカウントの切り替え方法

1\. アクセスポータルにアクセスする

2\. IAM Identity Center で作成したユーザー名でログインする

- パスワードは、 IAM Identity Center でユーザーの作成をした後に、登録したメールアドレスの方にパスワードの設定をするリンクが貼られた確認メールが届く

3\. そのユーザーが割り振られたアカウントとその権限が表示される

<img src="./img/IAM Identity Center10.png" />

<br>
<br>
<br>

以下の場合は、IAM Identity Centerにあるアクセスポータルから再びアカウント/ユーザー/権限を選択し直す

- 選択したユーザーでの操作が終了し、同アカウントユーザーで他の権限に切り替えたい場合(スイッチロールみたいなイメージ)

- 選択したユーザーでの操作が終了し、他アカウントに切り替えたい場合

- 選択したユーザーでの操作が終了し、同アカウントに紐づいている他ユーザーに切り替えたい場合

