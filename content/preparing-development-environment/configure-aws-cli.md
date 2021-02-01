---
title: "Configure your AWS CLI"
date: 2021-01-14T21:18:27Z
draft: false
weight: 130
pre: '<b style="color:#fff;">4. </b>'
---

4.1\. Inside the Cloud9 environment, in the **bash** terminal we are going to configure the AWS CLI with your **WorkshopAdmin** credentials as follows:

```bash
aws configure
```

- Configuration:
    - AWS Access Key ID: **(Type your Access key ID)**
    - AWS Secret Access Key: **(Type your Secret access key)**
    - Default region name [None]: **(Use your region code, example: us-east-1)** [All Regions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions)
    - Default output format [None]: **json**

4.2\. Remove **aws_session_token** variable from aws credentials.

```bash
sed -i 's/aws_session_token =//g' ~/.aws/credentials
```