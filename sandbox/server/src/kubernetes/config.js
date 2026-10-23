import * as k8sApi from '@kubernetes/client-node';

const kc = new k8sApi.KubeConfig();
kc.loadFromDefault();

const k8sCoreV1Api = kc.makeApiClient(k8sApi.CoreV1Api);

export { k8sCoreV1Api };
