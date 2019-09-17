# Deploy a Node.js backend using the AWS CDK

## 1. Install requirements

1.1\. Install the Amazon ECS CLI.

``` bash
sudo curl -o /usr/local/bin/ecs-cli https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest
sudo chmod +x /usr/local/bin/ecs-cli
ecs-cli --version
```

Reference: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_installation.html

1.2\. Install the AWS Cloud Development Kit.

``` bash
npm install -g aws-cdk
cdk --version
```

Reference: https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install

1.3\. Install the JQ command.

``` bash
sudo yum install jq -y
```

1.4\. Inside your **environment** folder clone the repository project from GitHub.

``` bash
cd ~/environment/
git clone https://github.com/aurbac/msg-app-backend.git
```

1.5\. Install the latest Boto 3 release via pip.

``` bash
python -m pip install --user boto3
```

## 2. Creating and initializing a new AWS CDK app

2.1\. Create a directory for your app with an empty Git repository.

``` bash
cd ~/environment/
mkdir cdk-msg-app-backend
cd cdk-msg-app-backend
```

2.2\. To initialize your new AWS CDK app use the **cdk init** command as follows.

``` bash
cdk init --language typescript
```

2.3\. Install the packages required for this project.

``` bash
npm install @aws-cdk/aws-ec2 @aws-cdk/aws-ecs @aws-cdk/aws-ecr @aws-cdk/aws-ecs-patterns @aws-cdk/aws-iam @aws-cdk/aws-dynamodb @aws-cdk/aws-elasticloadbalancingv2
```

2.4. Explore your project directory, yuo will have the following files:

* **lib/cdk-msg-app-backend-stack.ts** is where the your CDK application’s main stack is defined. This is the file we’ll working on.

* **bin/cdk-msg-app-backend.ts** is the entrypoint of the CDK application. It will load the stack defined in lib/cdk-msg-app-backend-stack.ts.

![CDK Files](images3/cdk-files.png)

## 3. Creating an Amazon DynamoDB Table

3.1\. Add the following import statements to **lib/my_ecs_construct-stack.ts**.

``` typescript
import dynamodb = require("@aws-cdk/aws-dynamodb");
```

3.2\. Replace the comment "**The code that defines your stack goes here**" at the end of the constructor with the following code.

``` typescript
    const table = new dynamodb.Table(this, 'Messages', {
      partitionKey: {
        name: 'app_id',
        type: dynamodb.AttributeType.STRING
      }, 
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.NUMBER
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    new cdk.CfnOutput(this, 'TableName', { value: table.tableName });
```

3.3\. Save it and make sure it builds and creates a stack.

``` bash
npm run build
cdk synth
```

3.4\. Deploy the stack.

``` bash
cdk deploy
```

3.5\. Open the Amazon DynamoDB console on **Tables** https://console.aws.amazon.com/dynamodb/home?#tables:, you will see the **messages** table.

3.6 Go to your Node.js project folder.

``` bash
cd ~/environment/msg-app-backend/
```

3.7\. Obtain the DynamoDB Table name created and export it as an environment variable with the following command.

``` bash
export MY_TABLE_NAME=`aws cloudformation describe-stacks --stack-name CdkMsgAppBackendStack | jq '.Stacks[0].Outputs[0].OutputValue' | tr -d \"`
echo $MY_TABLE_NAME
```

3.8\. Feed the DynamoDB Table.

``` bash
python db/batch_writing.py
```
3.9\. Open the Amazon DynamoDB console at https://console.aws.amazon.com/dynamodb/, in **Tables** section, select your table and explore the **Items** inserted.

![DynamoDb Table](images3/dynamodb-table-items.png)

## 4. Creating the network environment with Amazon VPC

4.1 Return to your CDK project folder.

``` bash
cd ~/environment/cdk-msg-app-backend/
```

4.2\. Add the following import statements to **lib/my_ecs_construct-stack.ts**.

``` typescript
import ec2 = require("@aws-cdk/aws-ec2");
```

4.3\. Add the following code at the end of the constructor.

``` typescript
    const vpc = new ec2.Vpc(this, "My-Vpc", {
      cidr: "10.1.0.0/16",
      natGateways: 1,
      subnetConfiguration: [
        {  cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC, name: "Public" },
        {  cidrMask: 24, subnetType: ec2.SubnetType.PRIVATE, name: "Private" }
        ],
      maxAzs: 3 // Default is all AZs in region
    });
```

4.4\. Save it and make sure it builds and creates a stack.

``` bash
npm run build
cdk synth
```

4.5\. Deploy the stack.

``` bash
cdk deploy
```

4.6\. Open the Amazon VPC console on **Your VPCs** https://console.aws.amazon.com/vpc, you will see your new VPC with **2 public** and **2 private** subnets.

## 5. Creating an Amazon ECR repository

5.1\. Add the following import statements to **lib/my_ecs_construct-stack.ts**.

``` typescript
import ecr = require("@aws-cdk/aws-ecr");
```

5.2\. Add the following code at the end of the constructor.

``` typescript
    const repository = new ecr.Repository(this, "Api", {
      repositoryName: "my-api"
    });
```

5.3\. Save it and make sure it builds and creates a stack.

``` bash
npm run build
cdk synth
```

5.4\. Deploy the stack.

``` bash
cdk deploy
```

5.5\. Open the Amazon ECR console on **Repositories** https://console.aws.amazon.com/ecr, you will see your new repository.

## 6. Create the Image Docker for your backend and upload to Elastic Container Registry

6.1 Go to your Node.js project folder.

``` bash
cd ~/environment/msg-app-backend/
```

6.2\. Install the application dependencies.

``` bash
npm install
```

6.3\. Build the image docker.

``` bash
docker build -t my-api .
```

6.4\. Upload the local image using the ECS CLI.

``` bash
ecs-cli push my-api
```

## 7. Creating an Amazon ECS Cluster and Task Definition

7.1 Return to your CDK project folder.

``` bash
cd ~/environment/cdk-msg-app-backend/
```

7.2\. Add the following import statements to **lib/my_ecs_construct-stack.ts**.

``` typescript
import ecs = require("@aws-cdk/aws-ecs");
import iam = require("@aws-cdk/aws-iam");
```

7.3\. Add the following code at the end of the constructor to create the Amazon ECS Cluster.

``` typescript
    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });
```

7.4\. Add the following code at the end of the constructor to create the Task Definition that contains the Docker container to use.

``` typescript
    const executionRolePolicy =  new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ]
    });
    
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'ApiTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256,
    });
    fargateTaskDefinition.addToExecutionRolePolicy(executionRolePolicy);
    fargateTaskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['dynamodb:*']
    }));
    
    const container = fargateTaskDefinition.addContainer("Api", {
      // Use an image from Amazon ECR
      image: ecs.ContainerImage.fromRegistry(repository.repositoryUri),
      environment: { 
        'DYNAMODB_MESSAGES_TABLE': table.tableName,
        'APP_ID' : 'my-app'
      }
      // ... other options here ...
    });
    
    container.addPortMappings({
      containerPort: 3000
    });
```

7.5\. Save it and make sure it builds and creates a stack.

``` bash
npm run build
cdk synth
```

7.6\. Deploy the stack.

``` bash
cdk deploy
```

7.7\. Open the Amazon ECS console on **Clusters** and **Task Definitions** https://us-east-1.console.aws.amazon.com/ecs/, you will see your new cluster and task definition.

## 8. Creating an Amazon ECS Service with AutoScaling and exposed using an Application Load Balancer

8.1\. Add the following import statements to **lib/my_ecs_construct-stack.ts**.

``` typescript
import ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
```

8.2\. Add the following code at the end of the constructor to create the Fargate Service with Auto Scaling.

``` typescript
    const sg_service = new ec2.SecurityGroup(this, 'MySGService', { vpc: vpc });
    sg_service.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(3000));
    
    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 2,
      assignPublicIp: false,
      securityGroup: sg_service
    });
    
    // Setup AutoScaling policy
    const scaling = service.autoScaleTaskCount({ maxCapacity: 6, minCapacity: 2 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });
```

8.3\. Add the following code at the end of the constructor to create the Application Load Balancer and the Fargate Service associated.

``` typescript
    const lb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true
    });

    const listener = lb.addListener('Listener', {
      port: 80,
    });

    listener.addTargets('Target', {
      port: 80,
      targets: [service],
      healthCheck: { path: '/api/' }
    });

    listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');
```

!!! info
    You can find the [final file **lib/my_ecs_construct-stack.ts** here](https://github.com/aurbac/cdk-msg-app-backend/blob/master/lib/cdk-msg-app-backend-stack.ts). 

8.4\. Save it and make sure it builds and creates a stack.

``` bash
npm run build
cdk synth
```

8.5\. Deploy the stack.

``` bash
cdk deploy
```

8.6\. Open the Amazon ECS console on **Clusters** https://us-east-1.console.aws.amazon.com/ecs/, explore your cluster, you will see a service running with 2 tasks.

![ECS Service Tasks](images3/ecs-service-tasks.png)

8.7\. Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/.

8.8\. In the navigation pane, under **LOAD BALANCING**, choose **Load Balancers**.

8.9\. Select the **backend** balancer, in the **Description** section copy the **DNS Name** to test in your bworser, you will see the code for the AWS Region.

![ALB List](images3/ec2-alb-dns-name.png)

8.10\. Test the DNS Name with `/api/messages` to see the messages.

![ECS ALB](images3/ecs-alb-messages.png)