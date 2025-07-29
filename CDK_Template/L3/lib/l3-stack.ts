import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import {MyVPCPattern} from "./aws-my-vpc-pattern";

export class L3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'L3Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    new MyVPCPattern(this, "MyVPCStack");

  }
}
