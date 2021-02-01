---
title: "Install prerequisites"
date: 2021-01-14T21:17:39Z
draft: false
weight: 100
pre: '<b style="color:#fff;">1. </b>'
---

1.1\. Install the Amazon **ECS CLI**, will be used to push the image docker to an Amazon ECR repository with the **ecs-cli push** command.

``` bash
sudo curl -o /usr/local/bin/ecs-cli https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest
sudo chmod +x /usr/local/bin/ecs-cli
ecs-cli --version
```

Reference: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_installation.html

1.2\. Install the latest version of **CDK** and check the version.

``` bash
npm install -g aws-cdk --force
cdk --version
```

If is not installed, you can find the instructions to install here: https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install

1.3\. Install the **JQ** command.

``` bash
sudo yum install jq -y
```

1.4\. Install the latest **Boto3** SDK release via **pip**.

``` bash
python -m pip install --user boto3
```

1.5\. Inside your **environment** folder clone the repository project from GitHub.

``` bash
cd ~/environment/
git clone https://github.com/aurbac/msg-app-backend.git
```