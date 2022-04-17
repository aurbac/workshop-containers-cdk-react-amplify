---
title: "Create a CodeCommit repository"
date: 2021-01-14T21:17:39Z
draft: false
weight: 180
pre: '<b style="color:#fff;">9. </b>'
---

9.1\. In **lib/cdk-msg-app-backend-stack.ts**, add the following below the last import.

``` typescript
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
```

9.2\. In **lib/cdk-msg-app-backend-stack.ts**, add the following code inside the constructor.

``` typescript
    const code = new codecommit.Repository(this, 'Repository' ,{
      repositoryName: 'msg-app-backend',
      description: 'Node.js backend.', // optional property
    });
```

9.3\. Save it and make sure it builds and creates a stack.

``` bash
cdk synth
```

9.4\. Deploy the stack.

``` bash
cdk deploy
```