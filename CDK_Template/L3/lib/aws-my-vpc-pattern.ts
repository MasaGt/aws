/**
 * 自作のL3コンストラクトクラス
 * VPC (2つのパブリックサブネット + 2つのプライベートサブネット)
 * 1台の踏み台サーバー (ec2)
 */

import { aws_ec2, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// L3コンストラクトの設定項目
export interface MyVPCPatternProps {}

export class MyVPCPattern extends Construct {

    constructor (scope: Construct, id: string) {
        super(scope, id);

        //vpcリソースの作成
        const vpc = new aws_ec2.Vpc(scope, "MyVPC", {
            maxAzs: 2, //使用するAZは2つ
            natGateways: 0 //NAT Gatewayは作成しない
        });

        //踏み台サーバー(ec2)の作成
        const basition = new aws_ec2.Instance(scope, "MyBastion", {
            vpc,
            instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T2, aws_ec2.InstanceSize.MICRO),
            machineImage: aws_ec2.MachineImage.latestAmazonLinux2023(),
            vpcSubnets: {
                subnetType: aws_ec2.SubnetType.PUBLIC
            }
        });

        new CfnOutput(scope, "MyBastionInfo", {
            value: basition.instancePublicIp,
            description: "Public IP Address of the bastion server"
        });
    }
}