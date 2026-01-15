/**
 * Navigation Service
 * Allows navigation from outside React components (e.g., axios interceptors)
 * This is a workaround to use React Router navigation in non-React contexts
 */

let navigate = null;

export const setNavigate = (nav) => {
  navigate = nav;
};

export const getNavigate = () => {
  return navigate;
};
