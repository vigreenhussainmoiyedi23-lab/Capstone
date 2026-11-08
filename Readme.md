To START THE KUBERNETES CLUSTER TO WORK

- INSTALL DOCKER DESKTOP AND ENABLE KUBERNETES
- INSTALL INGRESS CONTROLLER BY RUNNING THIS COMMAND IN YOUR TERMINAL
  `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml`
- Use secrets.yml.example for making a secrets.yml having every env key

- START THE WHOLE KUBERNETES CLUSTER
  `skaffold dev`
- START THE FRONTEND
  ` cd frontend`
  `npm run dev`
- GO TO THIS URL
  "http://localhost:5173"
