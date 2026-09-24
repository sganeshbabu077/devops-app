pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO   = '700030738273.dkr.ecr.ap-south-1.amazonaws.com/devops-app'
    }

    stages {

        stage('AWS Identity') {
            steps {
                withAWS(
                    credentials: 'jenkins-aws',
                    region: 'ap-south-1'
                ) {
                    bat 'aws sts get-caller-identity'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat '''
                    docker build -t devops-app:%BUILD_NUMBER% .
                '''
            }
        }

        stage('ECR Login') {
            steps {
                withAWS(
                    credentials: 'jenkins-aws',
                    region: 'ap-south-1'
                ) {
                    bat '''
                        aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %ECR_REPO%
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                bat '''
                    docker tag devops-app:%BUILD_NUMBER% %ECR_REPO%:%BUILD_NUMBER%
                    docker push %ECR_REPO%:%BUILD_NUMBER%
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                withAWS(
                    credentials: 'jenkins-aws',
                    region: 'ap-south-1'
                ) {
                    bat '''
                        aws eks update-kubeconfig --region %AWS_REGION% --name devops-project-eks

                        kubectl set image deployment/devops-app devops-app=%ECR_REPO%:%BUILD_NUMBER%

                        kubectl rollout status deployment/devops-app --timeout=180s
                        if errorlevel 1 exit /b 1

                        kubectl get pods
                    '''
                }
            }
        }
    }
}