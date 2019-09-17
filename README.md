# Deploy Application Backend with Node.js and Frontend with Angular

Hello, this is a self-paced workshop designed to explore Amazon VPC, Amazon DynamoDB, Amazon ECS, Amazon S3 and Amazon CloudFront.

![Nodejs Angular](docs/images/nodejs-angular.png)

## AWS Account Required

In order to complete these workshops you'll need a valid active AWS Account with Admin permissions. Use a personal account or create a new AWS account to ensure you have the neccessary access. This should not be an AWS account from the company you work for.

**If the resources that you use for this workshop are left undeleted you will incur charges on your AWS account.**

## To start

Visit the portal to get started: http://aws-msg-app.ws.kabits.com

## Modules

You must complete the following modules in **US East (N. Virginia)** region in order before proceeding to the next, to create the services you have two options, using the AWS Console or using CLIs and CloudFormation.

- **Option 1: Deploy using AWS Console**
    - [Create your VPC and Application Load Balancer for backend.](docs/create-vpc-alb.md)
    - [Prepare your development environment](docs/prepare-your-development-environment.md)
    - [Deploy a Node.js backend with Amazon ECS](docs/deploy-backedn-with-ecs.md)
    - [Deploy an Angular frontend with Amazon S3 and Amazon CloudFront](docs/deploy-frontend-with-s3-and-cloudfront.md)
- **Option 2: Deploy using AWS CDK and AWS Amplify**
    - [Prepare your development environment](docs/v2-prepare-your-development-environment.md)
    - [Deploy a Node.js backend with AWS CDK](docs/v2-deploy-backend.md)
    - [Deploy an Angular frontend with Amazon S3 and Amazon CloudFront with AWS Amplify](docs/v2-deploy-frontend.md)