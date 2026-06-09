import dspfRoutes from '../pages/DSPFPage/dspfRoutes';
import bmsRoutes from './../pages/BMSPage/bmsRoutes';

const basedRoutesConfig = {
  home: '/',
  convert: '/convert',
  // auth
  login: '/login',
  dashboard: '/admin',
  // user management
  userDetails: '/admin/user/:username',
  userCreate: '/admin/user/create',
  userUpdate: '/admin/user/update/:username',
  userChangePassword: '/admin/user/password/:username',
  userDelete: '/admin/user/delete/:username',
};

export const bmsRoutesConfig = bmsRoutes.map((route) => {
  return {
    [route.name]: route.name,
  };
});

export const dspfRoutesConfig = dspfRoutes.map((route) => {
  return {
    [route.name]: route.name,
  };
});

export default {
  ...basedRoutesConfig,
  ...bmsRoutesConfig,
  ...dspfRoutesConfig,
};
