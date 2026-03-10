export const hasPermission = (user, permission) => {
  if (!user) return false;

  return user.permissions.includes(permission);
};