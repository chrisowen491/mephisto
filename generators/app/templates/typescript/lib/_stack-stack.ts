import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as customresources from "@aws-cdk/custom-resources";
import * as iam from "@aws-cdk/aws-iam";

export class <%= stackName %>Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, "<%= lambdaName %>Handler", {
      runtime: lambda.Runtime.<%=runtime%>, 
      code: lambda.Code.fromAsset("build"),
      handler: "<%= lambdaName %>.handler"
    });

    const api = new apigateway.RestApi(this, "<%= lambdaName %>-api", {
      restApiName: "<%= lambdaName %> API",
      description: "<%= description %>",
      deployOptions: {
        stageName: "sit1"
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS
      }
    });

    const executeApiResource = new customresources.AwsCustomResource(this, "execute-api-resource", {
      functionName: "disable-execute-api-endpoint",
      onCreate: {
        service: "APIGateway",
        action: "updateRestApi",
        parameters: {
          restApiId: api.restApiId,
          patchOperations: [{
            op: "replace",
            path: "/disableExecuteApiEndpoint",
            value: "True"
          }]
        },
        physicalResourceId: customresources.PhysicalResourceId.of("execute-api-resource")
      },
      policy: customresources.AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["apigateway:PATCH"],
        resources: ["arn:aws:apigateway:*::/*"],
      })])
    });
    executeApiResource.node.addDependency(api);

    const domainName = apigateway.DomainName.fromDomainNameAttributes(this,
      "my-domain-name", {
      domainName: "<%= baseDomain %>",
      domainNameAliasTarget: "",
      domainNameAliasHostedZoneId: ""
  });

    //Used in custom domain
    const pathMapping = new apigateway.BasePathMapping(this,
      "path-mapping", {
      basePath: "<%= uriStem %>",
      domainName: domainName,
      restApi: api
    });

    const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", getWidgetsIntegration); // GET /
  }
}

