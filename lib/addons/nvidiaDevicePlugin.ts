import * as blueprints from '@aws-quickstart/eks-blueprints';
import { Construct } from "constructs";
import { createNamespace }  from "../utils/namespace"

export interface nvidiaDevicePluginAddOnProps extends blueprints.addons.HelmAddOnUserProps {

}

export const defaultProps: blueprints.addons.HelmAddOnProps & nvidiaDevicePluginAddOnProps = {
  chart: 'nvidia-device-plugin',
  name: 'nvidiaDevicePluginAddOn',
  namespace: 'nvidia-device-plugin',
  release: 'nvdp',
  version: '0.14.4',
  repository: 'https://nvidia.github.io/k8s-device-plugin'
}

export default class nvidiaDevicePluginAddon extends blueprints.addons.HelmAddOn {

  readonly options: nvidiaDevicePluginAddOnProps;

  constructor(props: nvidiaDevicePluginAddOnProps) {
    super({ ...defaultProps, ...props });
    this.options = this.props as nvidiaDevicePluginAddOnProps;
  }

  deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct> {

    const ns = createNamespace("nvidia-device-plugin-namespace-struct", 'nvidia-device-plugin', clusterInfo.cluster, true)

    const values = {
      nodeSelector: {
        "karpenter.k8s.aws/instance-gpu-manufacturer": "nvidia"
      },
      tolerations: [
        {
          effect: "NoSchedule",
          key: "runtime",
          operator: "Exists"
        },
        {
          effect: "NoSchedule",
          key: "nvidia.com/gpu",
          operator: "Exists"
        },
      ],
      config:{
          "name": "time-slicing-config",
          "default": "any"
      }
    };

    const conf = clusterInfo.cluster.addManifest(`slicingConfigmap`, {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: 'time-slicing-config',
        namespace: 'nvidia-device-plugin',
      },
      data: {
        any: 
`version: v1
flags:
  migStrategy: none
sharing:
  timeSlicing:
    resources:
    - name: nvidia.com/gpu
      replicas: 4`
      },
    });
    conf.node.addDependency(ns);

    const chart = this.addHelmChart(clusterInfo, values, true, true);

    return Promise.resolve(chart);
  }
}