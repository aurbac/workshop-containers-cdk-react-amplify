---
title: "Create the Docker Image for your backend and upload it to your repo on Elastic Container Registry"
date: 2021-01-14T21:17:39Z
draft: false
weight: 150
pre: '<b style="color:#fff;">6. </b>'
---

6.1 Go to your Node.js project folder.

``` bash
cd ~/environment/msg-app-backend/
```

6.2\. Build the image docker.

``` bash
docker build -t workshop-api .
```

6.3\. Upload the local image using the **ECS CLI**.

``` bash
ecs-cli push workshop-api
```

6.4\. Open the Amazon ECR console to see your **workshop-api** repository [https://console.aws.amazon.com/ecr/repositories](https://console.aws.amazon.com/ecr/repositories), you will see your latest image.

![ECR Image](../images/cloud9-ecr-image.png)