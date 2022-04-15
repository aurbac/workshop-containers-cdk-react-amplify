---
title: "Connect to CodeCommit and push changes to Git repository"
date: 2021-01-14T21:17:39Z
draft: false
weight: 190
pre: '<b style="color:#fff;">10. </b>'
---

10.1\. Your AWS Cloud9 development environment already have IAM credentiales configured, use these credentials with the AWS CLI credential helper. Enable the credential helper by running the following two commands in the terminal of your Cloud9 environment.

``` bash
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
```

10.2\. Inside the Cloud9 environment, go to **msg-app-backend** folder and remove remote from git project.

``` bash
cd ~/environment/msg-app-backend/
git remote remove origin
```

10.3\. Use your URL repository to add your new origin.

``` bash
export MY_REGION=`aws configure get region`
git remote add origin https://git-codecommit.$MY_REGION.amazonaws.com/v1/repos/msg-app-backend
```

10.4\. Configure Git with your name and email.

``` bash
git config --global user.name "Your Name"
git config --global user.email your-email@domain.com
```

10.5\. Edit the file **buildspec.yml** and replace **`<REPOSITORY_URI>`** with your URI from Amazon ECR Repository and save the file, use the editor included in Cloud9 environment or run the following commands.

``` bash
export REPOSITORY_URI=`aws ecr describe-repositories --repository-names workshop-api | jq '.repositories[0].repositoryUri' | tr -d \"`
sed -i "s~<REPOSITORY_URI>~$REPOSITORY_URI~g" buildspec.yml
```

![Cloud9 Buildspec](../images/cloud9-buildspec-change.png)

10.6\. Push the project to your CodeCommit repository.

``` bash
git add .
git commit -m "Buildspec"
git push origin master
```

10.7\. Now you can browse the content of your respository [https://us-east-1.console.aws.amazon.com/codesuite/codecommit/repositories/msg-app-backend/browse?region=us-east-1#](https://us-east-1.console.aws.amazon.com/codesuite/codecommit/repositories/msg-app-backend/browse?region=us-east-1#).

![CodeCommit Code](../images/codecommit-code.png)