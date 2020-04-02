declare module 'prefix-classname' {
  type TypeCls = (...arg: any[]) => string
  type TypePrefixCls = (prefix: string) => TypeCls

  const prefixCls: TypePrefixCls
  export = prefixCls
}
