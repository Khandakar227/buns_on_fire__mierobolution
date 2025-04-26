import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {

    const cookieStore = await cookies();
    const storedLocale = cookieStore.get('NEXT_LOCALE')?.value;

    const locale = storedLocale || 'en';

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});