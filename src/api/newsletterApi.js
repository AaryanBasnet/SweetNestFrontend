/**
 * Newsletter API
 */

import api from './api';

// Subscribe an email address (public). `website` is the honeypot field.
export const subscribeNewsletterApi = (email, website = '') => {
  return api.post('/newsletter/subscribe', { email, website });
};
