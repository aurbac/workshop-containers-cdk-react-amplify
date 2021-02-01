---
title: "Create an IAM User with administrator privileges"
date: 2021-01-14T21:17:39Z
draft: false
weight: 100
pre: '<b style="color:#fff;">1. </b>'
---

1.1\. Open the IAM console at https://console.aws.amazon.com/iam/.

1.2\. Choose **Users**, then **Add user**.

1.3\. Type a name for your user `WorkshopAdmin`, choose **Programmatic access** and click **Next: Permissions**.

![IAM User name](images/iam-user-name.png)

1.4\. Click **Attach permissions policies** and select **Administrator Access**, choose **Next: Tags**.

![User Policy](images/iam-user-policy.png)

1.5\. For **Add tags** choose **Next: Review**.

1.6\. Click **Create user**.

1.7\. To save the credentials, choose **Download .csv** and then save the file to a safe location, and **Close**.

![User Created](images/iam-user-created.png)