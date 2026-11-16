import { k8sCoreV1Api } from "./config.js";


export async function createPod(sandboxId, projectId) {
    const podManifest = {
        metadata: {
            name: `sandbox-${sandboxId}`,
            labels: {
                sandboxId: sandboxId,
            },
        },
        spec: {
            volumes: [
                {
                    name: "workspace-volume",
                    emptyDir: {}
                }
            ],
            initContainers: [
                {
                    name: "init-container",
                    image: "042215120799.dkr.ecr.ap-southeast-1.amazonaws.com/template",
                    imagePullPolicy: "IfNotPresent",
                    command: ["sh", "-c", "cp -r /workspace/. /seed/"],
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/seed",
                        }
                    ]
                }
            ],
            containers: [
                {
                    image: "042215120799.dkr.ecr.ap-southeast-1.amazonaws.com/template",
                    name: "sandbox-container",
                    imagePullPolicy: "Always",
                    ports: [
                        {
                            containerPort: 5173,
                            protocol: "TCP"
                        }
                    ],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi" },
                        requests: { cpu: "250m", memory: "512Mi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace",
                        }

                    ]

                },
                {
                    image: "042215120799.dkr.ecr.ap-southeast-1.amazonaws.com/agent",
                    name: "agent-container",
                    imagePullPolicy: "Always",
                    ports: [
                        {
                            containerPort: 3000,
                            protocol: "TCP"
                        }
                    ],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi" },
                        requests: { cpu: "250m", memory: "512Mi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace",
                        }

                    ]
                },
                {
                    image: "042215120799.dkr.ecr.ap-southeast-1.amazonaws.com/sync-agent",
                    imagePullPolicy: "Always",
                    name: "agent-sync-container",
                    ports: [
                        {
                            containerPort: 4000,
                            name: "http"
                        }
                    ],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi" },
                        requests: { cpu: "250m", memory: "512Mi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace",
                        }
                    ],
                    env: [
                        {
                            name: "PROJECT_ID",
                            value: projectId
                        },
                    ],
                    envFrom: [
                        {
                            secretRef: {
                                name: "aws"
                            }
                        }
                    ]
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


export async function deletePod(sandboxId) {
    const response = await k8sCoreV1Api.deleteNamespacedPod({
        name: `sandbox-${sandboxId}`,
        namespace: "default"
    }, {
        gracePeriodSeconds: 0,
    });
    return response
}