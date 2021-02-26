import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
const testStack = require('../../../lib/<%= stackName %>-stack');

const app = new cdk.App();
const stack = new testStack.<%= stackName %>Stack(app, 'MyTestStack');

test('API Gateway is Created', () => {
    
    expectCDK(stack).to(haveResource("AWS::ApiGateway::RestApi",{
      Description: "<%= description %>",
      Name: "<%= lambdaName %> Service"
    }));    
});

test('Base Path Mapping is Created', () => {
  
  expectCDK(stack).to(haveResource("AWS::ApiGateway::BasePathMapping",{
    "DomainName": "<%= baseDomain %>",
    "BasePath": "<%= uriStem %>"
  }));    
});
