#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ValidationStack } from '../lib/validation-stack';
import { S3Aspect } from '../lib/s3-aspect';
import { Aspects } from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new ValidationStack(app, 'ValidationStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

Aspects.of(stack).add(new S3Aspect());