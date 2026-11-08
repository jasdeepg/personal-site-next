import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';


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
