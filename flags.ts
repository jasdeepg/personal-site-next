import { flag } from 'flags/next';
import { createVercelAdapter } from '@flags-sdk/vercel';

// Use this deployment's OIDC identity, not the legacy FLAGS connection string.
const vercelAdapter = createVercelAdapter();

export const companyFlag = flag<boolean>({
  key: 'company-flag',
  defaultValue: false,
  adapter: vercelAdapter
});

export const showPlacesGraph = flag<boolean>({
  key: 'show-places-graph',
  defaultValue: true,
  adapter: vercelAdapter
});

export const showContactSection = flag<boolean>({
  key: 'show-contact-section',
  defaultValue: true,
  adapter: vercelAdapter
});
