import { type SidebarItemProps } from './SidebarItem';
import routeConfig, {
  bmsRoutesConfig,
  dspfRoutesConfig,
} from '../../../config/routeConfig';

// default menu items
const menuItems: SidebarItemProps[] = [
  {
    text: 'Convert',
    to: routeConfig.convert,
    isPrivate: false,
  },
  {
    text: 'Insert',
    to: routeConfig.userCreate,
    isPrivate: true,
  },
  {
    text: 'View',
    to: routeConfig.userDetails.replace(':username', 'johndoe123admin'),
    isPrivate: true,
  },
  {
    text: 'Update',
    to: routeConfig.userUpdate.replace(':username', 'johndoe123admin'),
    isPrivate: true,
  },
];

// bms menu items
const bmsMenuItems: SidebarItemProps[] = bmsRoutesConfig.map((route) => {
  let item: SidebarItemProps = { text: '', to: '', isPrivate: false };
  for (const key in route) {
    item.text = key;
    item.to = '/' + route[key];
  }

  return item;
});

// dspf menu items
const dspfMenuItems: SidebarItemProps[] = dspfRoutesConfig.map((route) => {
  let item: SidebarItemProps = { text: '', to: '', isPrivate: false };
  for (const key in route) {
    item.text = key;
    item.to = '/' + route[key];
  }

  return item;
});

export default [...menuItems, ...bmsMenuItems, ...dspfMenuItems];
