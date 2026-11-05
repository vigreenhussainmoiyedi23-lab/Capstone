

To START THE KUBERNETES CLUSTER TO WORK
- INSTALL DOCKER DESKTOP AND ENABLE KUBERNETES
- INSTALL INGRESS CONTROLLER BY RUNNING THIS COMMAND IN YOUR TERMINAL
  `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml                  `
- SET ENV VARIABLES OF AI-ORCHESTRATION BY MAKING A .env file AND THAN RUN THIS COMMAND
  `cd ai-orchestration`
  `kubectl create secret generic ai-env  --from-env-file=.env  --dry-run=client -o yaml | kubectl apply -f -`
- AFTER THAT JUST RUN THIS COMMANDS
  `cd ..`
  `kubectl apply -f ./k8s`
  `skaffold dev`
- START THE FRONTEND
  ` cd frontend`
  `npm run dev`
- GO TO THIS URL
  "http://localhost:5173"
