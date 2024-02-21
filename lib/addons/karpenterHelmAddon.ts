import * as blueprints from '@aws-quickstart/eks-blueprints';
import { Construct } from "constructs";

export interface karpenterHelmAddonProps extends blueprints.addons.HelmAddOnUserProps {
  
}

export const defaultProps: blueprints.addons.HelmAddOnProps & karpenterHelmAddonProps = {
  chart: 'karpenter',
  name: 'karpenter',
  namespace: 'karpenter',
  release: 'nvdp',
  version: 'v0.34.0',
  repository: 'oci://public.ecr.aws/karpenter/karpenter'
}

export default class karpenterHelmAddon extends blueprints.addons.HelmAddOn {

  readonly options: karpenterHelmAddonProps;

  constructor(props: karpenterHelmAddonProps) {
    super({ ...defaultProps, ...props });
    this.options = this.props as karpenterHelmAddonProps;
  }

  deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct> {

    const values = {
      settings:{
        clusterName: clusterInfo.cluster.clusterName,
        interruptionQueue: clusterInfo.cluster.clusterName,
      },
      controller:{
        resources:{
          requests:{
            cpu: 1,
            memory: "1Gi"
          },
          limits:{
            cpu: 1,
            memory: "1Gi"
          }
        }
      },
      serviceAccount: {
        create: true
      },
      taints:[
        {
          "effect": "NoSchedule",
          "key": "nvidia.com/gpu"        
        }
      ]
    };

    const chart = this.addHelmChart(clusterInfo, values, true, true);

    return Promise.resolve(chart);
  }
}