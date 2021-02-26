#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { <%= stackName %>Stack } from '../lib/<%= stackName %>-stack';

const app = new cdk.App();
new <%= stackName %>Stack(app, '<%= stackName %>Stack');