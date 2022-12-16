PCB Store Front Deployment Commands

npm run build
aws ecr get-login-password --region us-east-1 --profile ces | docker login --username AWS --password-stdin 570325721812.dkr.ecr.us-east-1.amazonaws.com
docker build -t pcb-react-storefront .
docker tag pcb-react-storefront:latest 570325721812.dkr.ecr.us-east-1.amazonaws.com/pcb-react-storefront:latest
docker push 570325721812.dkr.ecr.us-east-1.amazonaws.com/pcb-react-storefront:latest
aws ecs update-service --service pcb-react-storefront --cluster ces-frontend-cluster --force-new-deployment --region us-east-1 --profile ces

PCB MultiLocation Deployment Commands

npm run build
aws ecr get-login-password --region us-east-1 --profile ces | docker login --username AWS --password-stdin 570325721812.dkr.ecr.us-east-1.amazonaws.com
docker build -t pcb-ml-storefront .
docker tag pcb-ml-storefront:latest 570325721812.dkr.ecr.us-east-1.amazonaws.com/pcb-ml-storefront:latest
docker push 570325721812.dkr.ecr.us-east-1.amazonaws.com/pcb-ml-storefront:latest
aws ecs update-service --service pcb-ml-storefront --cluster pcb-cluster --force-new-deployment --region us-east-1 --profile ces
