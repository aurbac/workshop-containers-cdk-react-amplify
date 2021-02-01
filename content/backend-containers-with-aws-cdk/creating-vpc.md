---
title: "Creating the network environment with Amazon VPC"
date: 2021-01-14T21:17:39Z
draft: false
weight: 130
pre: '<b style="color:#fff;">4. </b>'
---

4.1 Return to your CDK project folder.

``` bash
cd ~/environment/cdk-msg-app-backend/
```

4.2\. In **lib/cdk-msg-app-backend-stack.ts**, add the following below the last import.

``` typescript
import * as ec2 from '@aws-cdk/aws-ec2';
```

4.3\. In **lib/cdk-msg-app-backend-stack.ts**, add the following code inside the constructor.

``` typescript
    const vpc = new ec2.Vpc(this, "workshop-vpc", {
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

4.6\. Open the Amazon VPC console on **Your VPCs** [https://console.aws.amazon.com/vpc/home?#vpcs:](https://console.aws.amazon.com/vpc/home?#vpcs:), you will see your new VPC with **2 public** and **2 private** subnets.