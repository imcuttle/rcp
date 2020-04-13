import { Page } from 'puppeteer'

declare const page: Page

declare module 'prefix-classname' {
  type TypeCls = (...arg: any[]) => string
  type TypePrefixCls = (prefix: string) => TypeCls

  const prefixCls: TypePrefixCls
  export = prefixCls
}

declare module 'tiny-i18n' {
  type I18nEnv = {
    setDictionary(dict: Object, lang?: string)
    extendDictionary(dict: Object, lang?: string)
    setLanguage(lang: string)
  }

  const env: I18nEnv & { createIsolateI18n: () => I18nEnv }
  export = env
}
