---
title: "Add hosting and publish your React application"
date: 2021-01-14T21:17:39Z
draft: false
weight: 120
pre: '<b style="color:#fff;">3. </b>'
---

3.1\. Add hosting to your Amplify project.

``` bash
amplify add hosting
```

* ? Select the plugin module to execute **Amazon CloudFront and S3**
* ? Select the environment setup: **PROD (S3 with CloudFront using HTTPS)**
* ? hosting bucket name **(Use default)** 

3.2\. Publish your React application.

``` bash
amplify publish
```

* ? Are you sure you want to continue? **Yes**

3.3\. After your app is published, use the endpoint resulted to get into your application.

{{% notice info %}}
This may take a few minutes to create the Amazon CloudFront distribution.
{{% /notice %}}

![CloudFront Dist](../images/cloud9-publish.png)

![CloudFront Frontend](../images/cloudfront-frontend.png)