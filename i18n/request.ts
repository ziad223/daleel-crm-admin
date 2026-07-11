import {getRequestConfig} from 'next-intl/server';
import fs from 'fs/promises';
import path from 'path';

const locales = ['en', 'ar'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;
  let currentLocale = locale || 'ar';
  if (!locales.includes(currentLocale)) {
    currentLocale = 'ar';
  }

  const messagesPath = path.resolve(process.cwd(), `messages/${currentLocale}.json`);
  const messagesFile = await fs.readFile(messagesPath, 'utf-8');

  return {
    locale: currentLocale,
    messages: JSON.parse(messagesFile)
  };
});
