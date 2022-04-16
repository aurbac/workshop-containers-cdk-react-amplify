---
title: "Update React application to use the API exposed with CloudFront"
date: 2021-01-14T21:17:39Z
draft: false
weight: 140
pre: '<b style="color:#fff;">5. </b>'
---

5.1\. Edit the file **src/App.js** by changing the **<DNS_NAME_CLOUDFRONT>** with to your own CloudFront domain name  and save the file.

![Cloud9 Env Prod](../images/cloudfront-cloud9-new.png)

5.2\. Publish your React application changes with invalidation request to the Amazon CloudFront service to invalidate its cache..

``` bash
amplify publish --invalidateCloudFront
```

5.3\. Now test in your browser the application to see the messages `https://cloudfront-domain-name/`, you will see the messages from backend.

![React Application](../images/cloudfront-frontend-messages.png)

**Congratulations!!!! Now you have a React Application stored on Amazon S3 and a Nodejs backend using containers with Amazon ECS.**