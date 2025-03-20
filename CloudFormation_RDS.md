### CloudFormation での RDS リソース作成の基本 (非 Aurora DB インスタンスのマルチ AZ 配置 ver)

```yaml
Resources:
    MyRDS:
        Type: AWS::RDS::DBInstance #DBインスタンスの作成
        Properties:
            #----「エンジンのオプション」関連----
            Engine: "mysql" #★DBエンジン

            #----「可用性と耐久性」関連----
            MultiAZ: true #★マルチAZ配置を許可する

            #----「設定」関連----
            DBInstanceIdentifier: "myRDSInstance" #DBインスタンス識別子
            MasterUsername: "masterusername" #マスターユーザー名
            MasterUserPassword: "masteruserpassword" #マスターユーザーパスワード
            
            #----「インスタンスの設定」関連----
            DBInstanceClass: "db.t3.micro" #★DBインスタンスのCPUやメモリの構成

            #----「ストレージ」関連----
            StorageType: "gp3" #利用するストレージのタイプ
            AllocatedStorage: "20" #割り当てるストレージ容量(GB)

            #----「接続」関連----
            DBSubnetGroupName: "mySubnetGroup" #★指定するサブネットグループ名
            VPCSecurityGroups: 
                - "MyRDSSecurityGroup" #RDSインスタンスに付与するセキュリティグループ

            #----「追加設定」関連----
            DBName: "myDB" #作成するDB名
            DBParameterGroupName: "myParameterGroup" #RDSインスタンスに設定するパラメータグループ
            OptionGroupName: "myOptionGroup" #RDSインスタンスに設定するオプショングループ
```

#### 注意点

- ★★★`MultiAZ: true` を設定することでマルチ AZ 配置が有効になり、1つの RDS インスタンスの定義でプライマリとスタンバイ RDS インスタンスの2つが作成される

<br>
<br>

参考サイト

[AWS::RDS::DBInstance](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbinstance.html)

---

### DBSecurityGroups と VPCSecurityGroups

- ★どちらとも作成する RDS インスタンスに付与するセキュリティグループを指定するための要素

- ★★どちらかを定義した場合、もう一方の要素を定義してはならない

- ★★★DBSecurityGroups は古いリージョンで利用する下位互換のための要素であり、普通に利用する分には VPCSecurityGroups を指定する

<br>
<br>

参考サイト

[CloudFormation備忘録](https://qiita.com/ej2kd/items/ed17c0f3109590f1d33f#rdsのセキュリティグループ)

---

### (非 Autora) RDS のコンソール画面での項目とCloudFormationでの要素の対応づけ

- ★選択する DB エンジンによっては、選択項目に違いがある可能性があることに注意

<br>

<img src="./img/CloudFormation-RDS_1.png" />

---

### リードレプリカの追加

```yaml
Resources:

    #プライマリ RDS インスタンスの作成
    MyRDS:
        Type: AWS::RDS::DBInstance 

    #★★★リードレプリカの作成
    ReadReplica:
        Type: AWS::RDS::DBInstance
        Properties: 
            SourceDBInstanceIdentifier: !Ref MyRDS #★レプリケーション元のRDSインスタンスのIDを指定
            MultiAZ: false
            #その他の設定(ストレージやセキュリティグループなど)
```

<br>

#### 注意点

1. `SourceDBInstanceIdentifier` を指定する場合、`DBSnapshotIdentifier` を指定してはいけない

    - リードレプリカはスナップショットからは作成できないため

<br>

2. リードレプリカ定義に `DBName`, `MasterUsername`, `MasterUserPassword`, `BackupRetentionPeriod`, `PreferredBackupWindow` を指定してはいけない

    - これらの値はレプリケーション元から継承されるため

<br>

3. Aurora RDS インスタンスを作成する場合、リードレプリカは自動で作成されるため、`SourceDBInstanceIdentifier` を指定してはいけない

