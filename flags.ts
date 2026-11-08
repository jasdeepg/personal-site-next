import { flag } from 'flags/next';
import { createVercelAdapter } from '@flags-sdk/vercel';

// Use this deployment's OIDC identity, not the legacy FLAGS connection string.
const vercelAdapter = createVercelAdapter();

export const companyFlag = flag<boolean>({
  key: 'company-flag',
  adapter: vercelAdapter
});

export const showPlacesGraph = flag<boolean>({
  key: 'show-places-graph',
  adapter: vercelAdapter
});

export const showContactSection = flag<boolean>({
  key: 'show-contact-section',
  adapter: vercelAdapter
});
