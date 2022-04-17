---
title: "Create your CodePipeline"
date: 2021-01-14T21:17:39Z
draft: false
weight: 200
pre: '<b style="color:#fff;">11. </b>'
---

11.1 Return to your CDK project folder.

``` bash
cd ~/environment/cdk-msg-app-backend/
```

11.2\. In **lib/cdk-msg-app-backend-stack.ts**, add the following below the last import.

``` typescript
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
```

11.3\. In **lib/cdk-msg-app-backend-stack.ts**, add the following code inside the constructor

``` typescript
    const project = new codebuild.PipelineProject(this, 'MyProject',{
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
        privileged: true
      },
    });
    const buildRolePolicy =  new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:GetRepositoryPolicy",
                "ecr:DescribeRepositories",
                "ecr:ListImages",
                "ecr:DescribeImages",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ]
    });
    project.addToRolePolicy(buildRolePolicy);
    
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: code,
      output: sourceOutput,
    });
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [buildOutput],
    });
    
    new codepipeline.Pipeline(this, 'MyPipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.EcsDeployAction({
              actionName: "ECS-Service",
              service: service, 
              input: buildOutput
            }
            )
          ]
        }
      ],
    });
```

11.4\. Save it and make sure it builds and creates a stack.

``` bash
cdk synth
```

11.5\. Deploy the stack.

``` bash
cdk deploy
```

* Do you wish to deploy these changes (y/n)? **y**

11.6\. Open the AWS CodePipeline console at [http://console.aws.amazon.com/codesuite/codepipeline/home](http://console.aws.amazon.com/codesuite/codepipeline/home).

11.7\. On the **Pipelines** page, choose your CDK pipeline.

![CodePipelie](../images/codepipeline-cdk-backendapi-select.png)

11.8\. You will see the pipeline **In progress** or **Succeeded**.

![CodePipelie](../images/codepipeline-cdk-complete-release.png)

11.8\. Now you can work in your **cdk-msg-app-backend** project and have continuous integration and continuous deployments every time you push to CodeCommit.