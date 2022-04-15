---
title: "Creating and initializing a new AWS CDK app"
date: 2021-01-14T21:17:39Z
draft: false
weight: 110
pre: '<b style="color:#fff;">2. </b>'
---

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

![CDK init](../images/cloud9-cdk-init.png)

2.3. Explore your project directory, you will have the following files:

* **lib/cdk-msg-app-backend-stack.ts** is where your CDK application’s main stack is defined. This is the file we’ll working on.

* **bin/cdk-msg-app-backend.ts** is the entrypoint of the CDK application. It will load the stack defined in lib/cdk-msg-app-backend-stack.ts.

![CDK Files](../images/cloud9-cdk-files.png)