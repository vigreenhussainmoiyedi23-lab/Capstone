import { k8sCoreV1Api } from "./config.js";


export async function createPod(sandboxId) {
    const podManifest = {
        metadata: {
            name: `sandbox-${sandboxId}`,
            labels: {
                app: "sandbox",
                sandboxId: sandboxId,
            },
        },
        spec: {
            containers: [
                {
                    image: "template:latest",
                    name: "sandbox-container",
                    imagePullPolicy: "IfNotPresent",
                    ports: [
                        {
                            containerPort: 5173,
                            protocol: "TCP"
                        }
                    ],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi" },
                        requests: { cpu: "250m", memory: "512Mi" }
                    }

                }
            ]
        }
    }
    const response = await k8sCoreV1Api.createNamespacedPod({
        namespace: "default", 
        body: podManifest
    });
    return response;
}


