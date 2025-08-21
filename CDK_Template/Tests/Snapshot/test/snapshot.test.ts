import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Snapshot from '../lib/snapshot-stack';

test('Snapshot', () => {
  const app = new cdk.App();
  const stack = new Snapshot.SnapshotStack(app, "LambdaStack")
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});




