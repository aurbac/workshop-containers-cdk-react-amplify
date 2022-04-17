---
title: "Creating an Amazon ECS Cluster and Task Definition"
date: 2021-01-14T21:17:39Z
draft: false
weight: 160
pre: '<b style="color:#fff;">7. </b>'
---

7.1 Return to your CDK project folder.

``` bash
cd ~/environment/cdk-msg-app-backend/
```

7.2\. In **lib/cdk-msg-app-backend-stack.ts**, add the following below the last import.

``` typescript
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
```

7.3\. In **lib/cdk-msg-app-backend-stack.ts**, add the following code inside the constructor to define an Amazon ECS Cluster.

``` typescript
    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });
```

7.4\. In **lib/cdk-msg-app-backend-stack.ts**, add the following code inside the constructor to create the Task Definition that contains the Docker container to use.

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
      resources: [table.tableArn],
      actions: ['dynamodb:*']
    }));
    
    const container = fargateTaskDefinition.addContainer("backend", {
      // Use an image from Amazon ECR
      image: ecs.ContainerImage.fromRegistry(repository.repositoryUri),
      logging: ecs.LogDrivers.awsLogs({streamPrefix: 'workshop-api'}),
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
cdk synth
```

7.6\. Deploy the stack.

``` bash
cdk deploy
```

* Do you wish to deploy these changes (y/n)? **y**

7.7\. Open the Amazon ECS console on **Clusters** and **Task Definitions** [https://console.aws.amazon.com/ecs/](https://console.aws.amazon.com/ecs/), you will see your new cluster and task definition.