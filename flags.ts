import { flag } from '@vercel/flags/next';

export const companyFlag = flag<boolean>({
  key: 'company-flag',
  description: 'Change company name',
  decide: () => false, // Default to false
});

export const showPlacesGraph = flag<boolean>({
  key: 'show-places-graph',
  description: 'Show the places lived graph on homepage',
  origin: 'https://vercel.com/docs/workflow-collaboration/feature-flags',
  decide: () => true, // Default to true (show the graph)
});

export const showContactSection = flag<boolean>({
  key: 'show-contact-section',
  description: 'Show contact email section on homepage',
  origin: 'https://vercel.com/docs/workflow-collaboration/feature-flags',
  decide: () => true, // Default to true (show contact section)
});
