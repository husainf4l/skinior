import {getRequestConfig} from 'next-intl/server';
import {routing} from './i18n/routing';

// Import messages directly to avoid dynamic import issues
import enMessages from '../messages/en.json';
import arMessages from '../messages/ar.json';

const messages = {
  en: enMessages,
  ar: arMessages
} as const;

export default getRequestConfig(async ({requestLocale}) => {
  // This function can be async
  let locale = await requestLocale;
  
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages],
    timeZone: 'UTC'
  };
});
