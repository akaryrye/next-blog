import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const API = publicRuntimeConfig.PRODUCTION
  ? publicRuntimeConfig.API_PROD
  : publicRuntimeConfig.API_DEV;

export const DOMAIN = publicRuntimeConfig.PRODUCTION
  ? publicRuntimeConfig.DOMAIN_PROD
  : publicRuntimeConfig.DOMAIN_DEV;

/*
const withCSS = require('@zeit/next-css');
module.exports = withCSS({
  cssModules: true
});
*/