import { SubcategoryData } from './types';
import { SUBCATEGORY_DATA_RECORDS_ESTIMATE } from './data-records-estimate';
import { SUBCATEGORY_DATA_MULTIPLIERS_RESET } from './data-multipliers-reset';
import { SUBCATEGORY_DATA_PAYG_HIGHDATA } from './data-payg-highdata';
import { SUBCATEGORY_DATA_OCCASIONAL_VIDEO } from './data-occasional-video';
import { SUBCATEGORY_DATA_AI_MOBILE } from './data-ai-mobile';
import { SUBCATEGORY_DATA_DEVICES_RECONCILE_KNOWLEDGE } from './data-devices-reconcile-knowledge';

export const ALL_SUBCATEGORIES_DATA: Record<string, SubcategoryData> = {
  ...SUBCATEGORY_DATA_RECORDS_ESTIMATE,
  ...SUBCATEGORY_DATA_MULTIPLIERS_RESET,
  ...SUBCATEGORY_DATA_PAYG_HIGHDATA,
  ...SUBCATEGORY_DATA_OCCASIONAL_VIDEO,
  ...SUBCATEGORY_DATA_AI_MOBILE,
  ...SUBCATEGORY_DATA_DEVICES_RECONCILE_KNOWLEDGE
};
