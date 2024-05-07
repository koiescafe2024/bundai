import { thTH_account } from './account';
import { th_TH_component } from './component';
import { thTH_dashboard } from './dashboard';
import { th_TH_documentation } from './documentation';
import { thTH_globalTips } from './global/tips';
import { thTH_guide } from './guide';
import { thTH_notice } from './notice';
import { thTH_permissionRole } from './permission/role';
import { thTH_avatorDropMenu } from './user/avatorDropMenu';
import { thTH_tagsViewDropMenu } from './user/tagsViewDropMenu';
import { thTH_title } from './user/title';

const th_TH = {
  ...thTH_account,
  ...thTH_avatorDropMenu,
  ...thTH_tagsViewDropMenu,
  ...thTH_title,
  ...thTH_globalTips,
  ...thTH_permissionRole,
  ...thTH_dashboard,
  ...thTH_guide,
  ...th_TH_documentation,
  ...thTH_notice,
  ...th_TH_component,
};

export default th_TH;
