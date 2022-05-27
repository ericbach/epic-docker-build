import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, FunctionUrl, FunctionUrlAuthType, Runtime, Code, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

import * as path from 'path';

export class MembershipFoundationsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // TODO Add the props to parameterize
    const vpc = Vpc.fromLookup(this, 'importedVPC', {
      vpcName: `vpc-${props?.env?.region}-ama`,
    });

    const prismaLayer = new LayerVersion(this, 'PrismaLayer', {
      compatibleRuntimes: [Runtime.NODEJS_14_X],
      code: Code.fromDockerBuild(path.join(__dirname, '../src/layers/prisma'), {
        file: 'Dockerfile',
      }),
      layerVersionName: `prisma-layer-${props?.tags?.env}`,
      description: 'Prisma Layer',
    });

    const customerFunction = new Function(this, 'CustomerService', {
      functionName: `customer-service-${props?.tags?.env}`,
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset(path.join(__dirname, '../src/lambda/customerService')),
      vpc: vpc,
      layers: [prismaLayer],
      environment: {
        REGION: Stack.of(this).region,
      },
      memorySize: 512,
      timeout: Duration.seconds(10),
    });

    const customerFunctionUrl = new FunctionUrl(this, 'CustomerServiceUrl', {
      function: customerFunction,
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, 'PrismaLayerVersionArn', { value: prismaLayer.layerVersionArn });
    new CfnOutput(this, 'CustomerFunctionArn', { value: customerFunction.functionArn });
    new CfnOutput(this, 'CustomerFunctionUrl', { value: customerFunctionUrl.url });
  }
}
