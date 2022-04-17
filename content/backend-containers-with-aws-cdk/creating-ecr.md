---
title: "Creating an Amazon ECR repository"
date: 2021-01-14T21:17:39Z
draft: false
weight: 140
pre: '<b style="color:#fff;">5. </b>'
---

5.1\. In **lib/cdk-msg-app-backend-stack.ts**, add the following below the last import.

``` typescript
import * as ecr from 'aws-cdk-lib/aws-ecr';
```

5.2\. In **lib/cdk-msg-app-backend-stack.ts**, add the following code inside the constructor.

``` typescript
    const repository = new ecr.Repository(this, "workshop-api", {
      repositoryName: "workshop-api"
    });
```

5.3\. Save it and make sure it builds and creates a stack.

``` bash
cdk synth
```

5.4\. Deploy the stack.

``` bash
cdk deploy
```

5.5\. Open the Amazon ECR console on **Repositories** [https://console.aws.amazon.com/ecr/repositories](https://console.aws.amazon.com/ecr/repositories), you will see your new repository.