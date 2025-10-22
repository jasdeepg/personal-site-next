import { flag } from '@vercel/flags/next';
import { vercelAdapter } from '@vercel-private/flags-adapter-native';


export const companyFlag = flag<boolean>({
  key: 'company-flag',
  adapter: vercelAdapter()
});

export const showPlacesGraph = flag<boolean>({
  key: 'show-places-graph',
  adapter: vercelAdapter()
});

export const showContactSection = flag<boolean>({
  key: 'show-contact-section',
  adapter: vercelAdapter()
});
