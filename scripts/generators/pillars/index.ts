import { ContentNode } from '../../content-meta';
import { generateHomePillar } from './home';
import { generateRecordsPillar } from './records';
import { generateEstimatePillar } from './estimate';
import { generateMultipliersPillar } from './multipliers';
import { generateResetPillar } from './reset';
import { generatePaygPillar } from './payg';
import { generateHighDataPillar } from './high-data';
import { generateOccasionalPillar } from './occasional';
import { generateVideoPillar } from './video';
import { generateAiPillar } from './ai';
import { generateMobilePillar } from './mobile';
import { generateDevicesPillar } from './devices';
import { generateReconcilePillar } from './reconcile';
import { generateKnowledgePillar } from './knowledge';

export function generatePillarHub(node: ContentNode): string {
  if (node.type === 'home') {
    return generateHomePillar();
  }

  switch (node.category) {
    case 'records':
      return generateRecordsPillar();
    case 'estimate':
      return generateEstimatePillar();
    case 'multipliers':
      return generateMultipliersPillar();
    case 'reset':
      return generateResetPillar();
    case 'payg':
      return generatePaygPillar();
    case 'high-data':
      return generateHighDataPillar();
    case 'occasional':
      return generateOccasionalPillar();
    case 'video':
      return generateVideoPillar();
    case 'ai':
      return generateAiPillar();
    case 'mobile':
      return generateMobilePillar();
    case 'devices':
      return generateDevicesPillar();
    case 'reconcile':
      return generateReconcilePillar();
    case 'knowledge':
      return generateKnowledgePillar();
    default:
      throw new Error(`未知的 Pillar Hub 类别: ${node.category}`);
  }
}
