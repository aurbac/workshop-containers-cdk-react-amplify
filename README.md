# Deploying an Application Backend with Node.js and Frontend with Angular

Hello, this is a self-paced workshop to create an Angular application hosted on Amazon S3 and Amazon CloudFront, it shows a lists of messages stored in a Amazon DynamoDB table, the messages are retrieved with a simple API based on Node.js/Docker container with continuous deployment using Amazon Container Service and AWS CodePipeline.

![Nodejs Angular](docs/images/nodejs-angular.png)

## AWS Account Required

In order to complete these workshops you'll need a valid active AWS Account with Admin permissions. Use a personal account or create a new AWS account to ensure you have the neccessary access. This should not be an AWS account from the company you work for.

**If the resources that you use for this workshop are left undeleted you will incur charges on your AWS account.**

## To start

Visit the portal to get started: http://aws-msg-app.ws.kabits.com

## Modules

You must complete the following modules in **US East (N. Virginia)** region in order before proceeding to the next, to create the services you have two options, using the AWS Console or using CLIs and CloudFormation.

- **Option 1: Deploy using AWS Console**
    - [Creating your VPC and Application Load Balancer for the backend](docs/create-vpc-alb.md)
    - [Preparing your development environment](docs/prepare-your-development-environment.md)
    - [Deploying a Node.js backend with Amazon ECS](docs/deploy-backedn-with-ecs.md)
    - [Deploying backend container with AWS CodePipeline to Amazon ECS](docs/deploying-backend-container-with-codepipeline-to-ecs.md)
    - [Deploying an Angular frontend with Amazon S3 and Amazon CloudFront](docs/deploy-frontend-with-s3-and-cloudfront.md)
- **Option 2: Deploy using AWS CDK and AWS Amplify**
    - [Preparing your development environment](docs/v2-prepare-your-development-environment.md)
    - [Deploying a Node.js backend with AWS CDK](docs/v2-deploy-backend.md)
    - [Deploying an Angular frontend with Amazon S3 and Amazon CloudFront with AWS Amplify](docs/v2-deploy-frontend.md)