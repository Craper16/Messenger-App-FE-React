export const HOME = '/';
export const SIGNIN = '/signin';
export const SIGNUP = '/signup';
export const PROFILE = '/profile';
export const CHANGE_PASSWORD = '/profile/change-password';
export const UPDATE_USER_INFO = '/profile/update-info';
export const SEARCH_SERVERS = '/servers/search';
export const BROWSE_SERVERS = '/servers/browse';
export const SERVER = '/servers/:serverId';
export const SERVER_NAV = (serverId: string) => `/servers/${serverId}`;
export const MANAGE_SERVER = '/servers/:serverId/manage';
export const MANAGE_SERVER_NAV = (serverId: string) =>
  `/servers/${serverId}/manage`;
