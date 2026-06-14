'use server'

import { cookies } from 'next/headers'
import ko from './ko'
import en from './en'
import type { Translations } from './ko'

export type Locale = 'ko' | 'en'

const LANG_COOKIE = 'lang'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const lang = cookieStore.get(LANG_COOKIE)?.value
  return (lang === 'en' ? 'en' : 'ko') as Locale
}

export async function getTranslations(): Promise<Translations> {
  const locale = await getLocale()
  return locale === 'en' ? en : ko
}

export async function setLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(LANG_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}
