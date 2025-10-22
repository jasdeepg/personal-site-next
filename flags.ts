import { flag } from '@vercel/flags/next';
import { vercelAdapter } from '@vercel/flags/adapters/vercel';

export const companyFlag = flag({
  key: 'company-flag',
  adapter: vercelAdapter(),
  description: 'Change company name',
  decide: () => false, // Default to false
});

export const showPlacesGraph = flag({
  key: 'show-places-graph',
  adapter: vercelAdapter(),
  description: 'Show the places lived graph on homepage',
  origin: 'https://vercel.com/docs/workflow-collaboration/feature-flags',
  decide: () => true, // Default to true (show the graph)
});

export const showContactSection = flag({
  key: 'show-contact-section',
  adapter: vercelAdapter(),
  description: 'Show contact email section on homepage',
  origin: 'https://vercel.com/docs/workflow-collaboration/feature-flags',
  decide: () => true, // Default to true (show contact section)
});

