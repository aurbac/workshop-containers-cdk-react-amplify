# Application Backend with Nodejs and Frontend with Angular

Hello, this is a self-paced workshop designed to explore Amazon VPC, Amazon ECS and Amazon CloudFront.

## 1. Create a VPC with two public and two private subnets

1.1\. Open the Amazon VPC console at https://console.aws.amazon.com/vpc/.

1.2\. In the navigation pane, choose Your VPCs and click on **Create VPC**.

1.3\. For the Name tag type `My VPC` and use the IPv4 CIDR block of `10.1.0.0/16`, click on **Create** and click on **Close**.

**Note:** Copy the **VPC ID** for the Public Subnet 01, you will use it later.

1.4\. In the navigation pane, choose Subnets, we are going to create four subnets as follows:

| Name tag | VPC | Availability Zone | IPv4 CIDR block |
| ------:| -----------:| -----------:| -----------:|
| Public Subnet 01  | My VPC | us-east-1a | 10.1.0.0/24 |
| Public Subnet 02  | My VPC | us-east-1b | 10.1.1.0/24 |
| Private Subnet 01  | My VPC | us-east-1a | 10.1.2.0/24 |
| Private Subnet 02  | My VPC | us-east-1b | 10.1.3.0/24 |

**Note:** Copy the **Subnet ID** for the Public Subnet 01, you will use it later.

1.5\. In the navigation pane, choose Route Tables and click **Create route table**.

1.6\. For the Name tag type `Public Route` and select `My VPC`, click on **Create** and click on **Close**.

1.7\. In the navigation pane, choose Internet Gateways and click **Create Internet gateway**, type Name Tag with `My IG`, click on **Create** and click on **Close**.

1.8\. Select `My IG` and click on **Actions > Attach to VPC**, choose `My VPC` and click **Attach**.

1.9\. In the navigation pane, choose NAT Gateways and click **Create NAT Gateway**.

1.10\. Select the Subnet ID for your Public Subnet 01 that you copied earlier, click on **Create New IP** and click on **Create a NAT Gateway** and click on **Close**.

1.11\. In the navigation pane, choose Route Tables and apply a filter using the VPC ID that you copied earlier, select the **Public Route**, click on **Routes** and click on **Edit Routes**, apply the following routes and click **Save routes**.

| Destination | Target | 
| ------:| -----------:| 
| 10.1.0.0/16 | local | 
| 0.0.0.0/0  | My IG (Internet Gateway) | 

1.12\. In the **Public Route**, click on **Subnet Associations** and click on **Edit subnet associations**, select the subnets **10.1.0.0/24** and **10.1.1.0/24** and click on **Save**.

1.13\. Now select the **Main** route table, this is our route table for private subnets, click on **Routes** and click on **Edit Routes**, apply the following routes and click **Save routes**.

| Destination | Target | 
| ------:| -----------:| 
| 10.1.0.0/16 | local | 
| 0.0.0.0/0  | NAT Gateway (Select the only one) |

## 2. Create the Application Load Balancer for the Backend

2.1\. Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/.

2.2\. In the navigation pane, under **LOAD BALANCING**, choose **Load Balancers**.

2.3\. Choose **Create Load Balancer**.

2.4\. On the **Select load balancer type** page, choose **Application Load Balancer** and then choose **Continue**.

2.5\. Complete the **Configure Load Balancer** page as follows:

  a\. For **Name**, type `backend` for your load balancer.

  b\. For **Scheme**, use an internet-facing load balancer routes requests from clients over the internet to targets.

  c\. For **IP address type**, choose ipv4 to support IPv4 addresses only or dualstack to support both IPv4 and IPv6 addresses.

  d\. For **Listeners**, the default is a listener that accepts HTTP traffic on port 80.

  e\. For **VPC**, select the `My VPC`.

  f\. For **Availability Zones**, select the check box for the Availability Zones to enable for your load balancer. For us-east-1a select the **Public Subnet 01** and for us-east-1b select **Public Subnet 02**.

  g\. Choose **Next: Configure Security Settings** and choose **Next: Configure Security Groups**.

  h\. Select **Create a new security group**, for the Security group name type `backend-alb` and choose **Next: Configure Routing**.

  i\. In the **Configure Routing** section, for **Name** type `backend`, for Target type, choose to register your targets with an IP address and choose **Next: Register Targets**.

  j\. Choose **Next: Review**, click on **Create** and **Close**.

## 3. Create Cloud9 instance for development

3.1\. Open the AWS Cloud9 console at https://console.aws.amazon.com/cloud9/.

3.2\. Click on **Create environment**.

3.3\. Type a Name of `MyDevelopmentInstance`, and choose **Next step**.

3.4\. Expand **Network settings (advanced)** and select your VPC ID and the Subnet ID (Public Subnet 01) that you copied earlier, and choose **Next step**.

3.5\. Click on **Create environment**.

3.6\. Now inside the **bash** terminal clone the reposiotry with `git clone https://github.com/aurbac/nodejs-back-and-angular-front.git`.

3.7\. Install the Angular CLI globally with `npm install -g @angular/cli`.

## 4. Create the backend docker image and upload to Amazon ECR

4.1\. Inside your Cloud9 environment got to the backend folder `cd /home/ec2-user/environment/nodejs-back-and-angular-front/backend`

4.2\. Install the node dependencies with `npm install`.

4.3\. Open the Amazon ECR console at https://console.aws.amazon.com/ecr/repositories/.

4.4\. Click on **Create repository**, type the name `backend` and click **Create repository**.

**Note:** Copy the **URI** for the backend repository, you will use it later.

4.5\. Click on the repository name **backend** and then click on **View push commands**.

4.6\. Go back to your Cloud9 environment on backend folder and execute the 5 commands of **Push commands for backend** (macOS/Linux).

## 5. Create the Task Definition

5.1\. Open the Amazon ECS console at https://console.aws.amazon.com/ecs/.

5.2\. In the navigation pane, under **Amazon ECS**, choose **Task Definitions**.

5.3\. Choose **Create new Task Definition**.

5.4\. On the **Select launch type compatibility** use **FARGATE** and click on **Next step**.

5.5\. Complete the **Configure task and container definitions** page as follows:

  a\. For **Task Definition Name** type `backend`.

  b\. For **Task Role** select `None`.

  c\. For **Task execution role** select `Create new role`.

  d\. For **Task memory (GB)** select `0.5GB`.

  e\. For **Task CPU (vCPU)** select `0.25 vCPU`.

  f\. Click on **Add container**.

  g\. For the **Container Name** type `backend`.

  h\. For the **Image** paste the URI repository that you copied earlier in step 4.4.

  i\. For the **Port mappings** type `3000` and click on **Add**.

  j\. Click on **Create**.

## 6. Create an Amazon ECS cluster and Service for the backend

6.1\. Open the Amazon ECS console at https://console.aws.amazon.com/ecs/.

6.2\. In the navigation pane, under **Amazon ECS**, choose **Clusters**.

6.3\. Choose **Create Cluster**.

6.4\. Select the option **Networking only - Powered by AWS Fargate** and click on **Next step**.

6.5\. For **Cluster name** type `backend-cluster` and click on **Create**.

6.6\. Click on **View Cluster**.

6.7\. In the **Services** sections click on **Create**.

6.8\. Complete the **Configure service** page as follows:

  a\. For **Launch type** select `FARGATE`.

  b\. For **Task Definition** select `backend`.

  b\. For **Cluster** select `backend-cluster`.

  c\. For **Service name** type `backend`.

  d\. For **Number of tasks** type `1`.

  e\. Click on **Next step**.

6.9\. Complete the **Configure network** page as follows:

  a\. For **Cluster VPC** select `My VPC`.

  b\. For **Subnets** select `Private Subnet 01` and `Private Subnet 02`.

  b\. For **Auto-assign public IP** select `DISABLED`.

  c\. For **Security Groups** click on **Edit**.

  d\. For **Inbound rules for security group** change the **Type** to `Custom TCP`.

  e\. For **Port range** type `3000` and click on **Save**.

  f\. For **Load balancer type** select **Application Load Balancer**.

  g\. For **Load balancer name** select `backend`.

  h\. Click on **Add to load balancer**.

  i\. For **Target group name** select `backend`.

  j\. Click on **Next step**.

6.10\. Complete the **Set Auto Scaling (optional)** page as follows:

  a\. For **Service Auto Scaling** select `Configure Service Auto Scaling to adjust your service’s desired count`.

  b\. For **Minimum number of tasks** type `2`.

  c\. For **Desired number of tasks** type `2`.

  d\. For **Maximum number of tasks** type `6`.

  e\. For **IAM role for Service Auto Scaling** select `Create new role`.

  f\. For **Policy name** type `RequestCount`.

  g\. For **ECS service metric** select `ALBRequestCountPerTarget`.

  h\. For **Target value** type `100`.

  i\. Click on **Next step**.

6.11\. Click on **Create Service**.

6.12\. Click on **View Service**.

6.13\. Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/.

6.14\. In the navigation pane, under **LOAD BALANCING**, choose **Load Balancers**.

6.15\. Select the **backend** balancer, in the **Description** section copy the **DNS Name** to test in your bworser, you will see the code for the AWS Region.

6.16\. Test the DNS Name with `/messages` to see the messages.

## 7. Upload Angular application to Amazon S3


