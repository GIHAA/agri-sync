// import React from 'react';

// interface PermissionsPayload {
//     permissions: string[];
// }

// const permissionChecker = (Component: React.ReactNode, permission: string , Replacement: React.ReactNode = <></>): React.ReactNode => {
//     const permissionsToken = localStorage.getItem('validationToken');

//     let availablePermissions: PermissionsPayload = { permissions: [] };

//     if (permissionsToken) {
//         try {
//             const payload = JSON.parse(atob(permissionsToken.split('.')[1]));
//             availablePermissions = payload.permissions ? payload : availablePermissions;
//         } catch (error) {
//             console.error('Invalid token format', error);
//         }
//     }

//     if (availablePermissions.permissions.includes(permission)) {
//         return Component;
//     } else {
//         return Replacement; 
//     }
// };

// export default permissionChecker;


import React from 'react';

interface PermissionsPayload {
  permissions: string[];
  role: string;
}

// Function to check if the user has a certain permission
const permissionChecker = (Component: React.ReactNode, permission: string, Replacement: React.ReactNode = <></>): React.ReactNode => {
  const permissionsToken = localStorage.getItem('validationToken');
  let availablePermissions: PermissionsPayload = { permissions: [], role: '' };

  if (permissionsToken) {
    try {
      const payload = JSON.parse(atob(permissionsToken.split('.')[1]));
      availablePermissions = payload.permissions ? payload : availablePermissions;
    } catch (error) {
      console.error('Invalid token format', error);
    }
  }

  // Check if the user has the required permission
  if (availablePermissions.role === 'SUPER_ADMIN' || availablePermissions.permissions.includes(permission)) {
    return Component;
  } else {
    return Replacement;
  }
};

export default permissionChecker;