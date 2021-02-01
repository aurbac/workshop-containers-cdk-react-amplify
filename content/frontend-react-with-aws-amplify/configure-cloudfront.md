---
title: "Configure backend with Amazon CloudFront"
date: 2021-01-14T21:17:39Z
draft: false
weight: 130
pre: '<b style="color:#fff;">4. </b>'
---

4.1\. Open the Amazon CloudFront console at https://console.aws.amazon.com/cloudfront/.

4.2\. Choose your distribution and click on Distribution Settings.

![CloudFront Dist](images/cloudfront-dist.png)

4.3\. Go to **Origins and Origin Groups** tab and click on **Create Origin**.

![CloudFront Origin](images/cloudfront-origin.png)

4.4\. For **Origin Domain Name** select your Application Load Balancer and choose **Create**.

![CloudFront Create Origin](images/cloudfront-create-origin.png)

4.5\. Go to **Behaviors** tab and click on **Create Behavior**.

![CloudFront Behaviors](images/cloudfront-behaviors.png)

4.6\. For **Create Behavior** complete as follows and choose **Create**:

* **Path Pattern**: **``/api*``**
* **Origin or Origin Group**: **``ELB-CdkMs-ALBAE--XXXXX``**
* **Allowed HTTP Methods**: **``GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE``**
* **Cache Policy**: **``Managed-CachingDisabled``**
* **Origin Request Policy**: **``Managed-AllViewer``**

![CloudFront Behaviors](images/cloudfront-create-beh.png)

{{% notice info %}}
This may take a few minutes to apply changes.
{{% /notice %}}