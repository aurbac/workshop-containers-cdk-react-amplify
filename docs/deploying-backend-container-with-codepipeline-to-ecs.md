# Deploying backend container with AWS CodePipeline to Amazon ECS

## 1. Create a CodeCommit repository 

1.1\. Open the CodeCommit console at https://console.aws.amazon.com/codesuite/codecommit/home.

1.2\. On the Repositories page, choose **Create repository**.

![Create a CodeCommit repository](images3/codecommit-create-repository.png)

1.3\. On the **Create repository** page, type `msg-app-backend` for **Repository name** and choose **Create**.

![CodeCommit name](images3/codecommit-name.png)

1.4\. Click on **Clone URL** and choose **Clone HTTPS**, the URL is copied, save it, you will use later.

![CodeCommit URL](images3/codecommit-url.png)

## 2. Create an IAM user for HTTPS Git credentials

2.1\. Open the IAM console at https://console.aws.amazon.com/iam/.

2.2\. In the navigation pane, choose **Users** and then choose **Add user**.

2.3\. In the **User Name** box, type `CodeCommitUser` as the name of the user, for **Access type** select the check box **Programmatic access** and then click **Next: Permissions**.

![CodeCommit User name](images3/iam-codecommit-user-name.png)

2.4\. For **Set permissions** select **Attach existing policies directly**, filter by typing `CodeCommitPowerUser` and from the list select **CodeCommitPowerUser** policy, choose **Next: Tags**.

![IAM User policy](images3/iam-codecommit-policy.png)

2.5\. Choose **Next: Review** to see all of the choices you made up to this point. When you are ready to proceed, choose **Create user** and **Close**.

![IAM User](images3/iam-codecommit-close.png)

2.6\. From the users list, click on **CodeCommitUser**.

![IAM User select](images3/iam-codecommit-select-user.png)

2.7\. On the user details page, choose the **Security Credentials** tab, and in **HTTPS Git credentials for AWS CodeCommit**, choose **Generate**.

![IAM User generate](images3/user-codecommit-generate.png)

2.8\. Copy the user name and password that IAM generated for you, either by showing, copying, and then pasting this information into a secure file on your local computer, or by choosing **Download credentials** to download this information as a .CSV file.

![IAM User download](images3/user-codecommit-download.png)

!!! info
    Open the csv file and use the new credentials to connect to CodeCommit.

## 3. Connect to CodeCommit and push changes to Git repository

3.1\. Open the AWS Cloud9 console at https://console.aws.amazon.com/cloud9/.

3.2\. In the list of environments, for the environment you want to open, inside of the card, choose **Open IDE**.

![Cloud9 Open](images2/cloud9-open.png)

3.3\. Inside the Cloud9 environment, in the **bash** terminal go inside **msg-app-backend** folder and remove remote from git project.

``` bash
cd ~/environment/msg-app-backend/
git remote remove origin
```

3.4\. Use your URL repository to add your new origin.

``` bash
export MY_REGION=`aws configure get region`
git remote add origin https://git-codecommit.$MY_REGION.amazonaws.com/v1/repos/msg-app-backend
```

3.5\. Configure Git with your name and email.

``` bash
git config --global user.name "Your Name"
git config --global user.email you@example.com
```

3.6\. Edit the file **buildspec.yml** and replace **`<REPOSITORY_URI>`** with your URI from Amazon ECS Repository and save the file, use the editor included in Cloud9 environment or run the following commands.

``` bash
export REPOSITORY_URI=`aws ecr describe-repositories --repository-names my-api | jq '.repositories[0].repositoryUri' | tr -d \"`
sed -i "s~<REPOSITORY_URI>~$REPOSITORY_URI~g" buildspec.yml
```

![Cloud9 Buildspec](images3/cloud9-buildspec-change.png)

3.7\. Push the project to your repository using the HTTPS Git Credentials.

``` bash
git add .
git commit -m "Buildspec"
git push origin master
```

![Cloud9 CodeCommit Push](images3/cloud9-codecommit-push.png)

## 4. Create Your Pipeline

4.1\. Open the AWS CodePipeline console at http://console.aws.amazon.com/codesuite/codepipeline/home.

4.2\. On the **Pipelines** page, choose **Create pipeline**.

![CodePipeline Welcome](images3/codepipeline-welcome.png)

4.3\. In **Step 1: Choose pipeline settings**, in **Pipeline name**, enter `BackendApi` and choose **Next**.

![CodePipeline Settings](images3/codepipeline-settings.png)

4.4\. In **Step 2: Add source stage**, in **Source provider**, choose **AWS CodeCommit**, For the **Repository name** select **msg-app-backend** and for **Branch name** select **master**. Choose **Next**.

![CodePipeline Source](images3/codepipeline-source.png)

4.5\. In **Step 3: Add build stage**, select **AWS CodeBuild** and choose **Create project**.

![CodePipeline Build Create Project](images3/codepipeline-build-create-project.png)

4.6\. For **Create build project** window, complete as follows and choose **Continue to CodePipeline**:

* **Project name**: **``BackendApi``**
* **Operating system**: Select **``Ubuntu``**
* **Runtime(s)**: Select **``Standard``**
* **Image**: Select **``aws/codebuild/standard:2.0``**
* **Image version**: select **``Always use the latest image for this runtime version``**
* **Privileged**: check **``Enable this flag if you want to build Docker images or want your builds to get elevated privileges``**

![CodePipeline Build name](images3/codepipeline-build-name.png)
![CodePipeline Build env](images3/codepipeline-build-env.png)

4.7\. Choose **Next**.

![CodePipeline Build next](images3/codepipeline-build-next.png)

4.8\. In **Step 4: Add deploy stage**, choose **Amazon ECS**, for the **Cluster name** select **backend-cluster** and for **Service name** select **backend**, and choose **Next**.

![CodePipeline Deploy](images3/codepipeline-deploy.png)

4.9\. In **Step 5: Review**, review the information, and then choose **Create pipeline**.

!!! info
    Your build stage is going to fail, next steps will help to fix it.

## 5. Add permissions to CodeBuild Service Role

5.1\. Open the IAM console at https://console.aws.amazon.com/iam/.

5.2\. In the navigation pane, choose **Roles** and search `codebuild-BackendApi-service-role`, click the **Role name**.

![IAM CodeBuild Role](images3/iam-codebuild-role.png)

5.3\. For **Permissions** choose **Attach policies**.

![IAM CodeBuild Role Attach Policies](images3/iam-codebuild-role-attach.png)

5.4\. For **Attach Permissions** filter by `AmazonEc2ContainerRegistryPowerUser` and select the **AmazonEc2ContainerRegistryPowerUser** policy, choose **Attach policy**.

![IAM CodeBuild Role Policy](images3/iam-codebuild-role-policy.png)

## 6. Release a change again for your Pipeline

6.1\. Open the AWS CodePipeline console at http://console.aws.amazon.com/codesuite/codepipeline/home.

6.2\. On the **Pipelines** page, choose **BackendApi**.

![CodePipelie](images3/codepipeline-backendapi-select.png)

6.3\. Choose **Release changes** and **Release**.

![CodePipelie](images3/codepipeline-release.png)
![CodePipelie](images3/codepipeline-release-confirm.png)

6.4\. Wait a few minutes until the deploy is completed.

![CodePipelie](images3/codepipeline-complete-release.png)