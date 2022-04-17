---
title: "Creating an Amazon ECS Service with AutoScaling and expose it using an Application Load Balancer"
date: 2021-01-14T21:17:39Z
draft: false
weight: 170
pre: '<b style="color:#fff;">8. </b>'
---

8.1\. In **lib/cdk-msg-app-backend-stack.ts**, add the following below the last import.

``` typescript
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Duration } from 'aws-cdk-lib';
```

8.2\. In **lib/cdk-msg-app-backend-stack.ts**, add the following code inside the constructor to create the Fargate Service with Auto Scaling.

``` typescript
    const sg_service = new ec2.SecurityGroup(this, 'MySGService', { vpc: vpc });
    sg_service.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(3000));
    
    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 2,
      assignPublicIp: false,
      securityGroups: [sg_service]
    });
    
    // Setup AutoScaling policy
    const scaling = service.autoScaleTaskCount({ maxCapacity: 6, minCapacity: 2 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60)
    });
```

8.3\. In **lib/cdk-msg-app-backend-stack.ts**, add the following code inside the constructor to create the Application Load Balancer and the Fargate Service associated.

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

8.4\. Save it and make sure it builds and creates a stack.

``` bash
cdk synth
```

8.5\. Deploy the stack.

``` bash
cdk deploy
```

* Do you wish to deploy these changes (y/n)? **y**

8.6\. Open the Amazon ECS console on **Clusters** [https://us-east-1.console.aws.amazon.com/ecs/v2/clusters?region=us-east-1](https://us-east-1.console.aws.amazon.com/ecs/v2/clusters?region=us-east-1), explore your cluster, you will see a service running with 2 tasks.

![ECS Service Tasks](../images/ecs-service-tasks.png)

8.7\. Open the Amazon EC2 console at [https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/).

8.8\. In the navigation pane, under **LOAD BALANCING**, choose **Load Balancers**.

8.9\. Select the **backend** balancer, in the **Description** section copy the **DNS Name** to test in your browser. you will see the code of the AWS Region you are using.

![ALB List](../images/ec2-alb-dns-name.png)

8.10\. Test the DNS Name with `/api/messages` to see the messages.

![ECS ALB](../images/ecs-alb-messages.png)