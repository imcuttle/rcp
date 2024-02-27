import { factory } from '@rcp/use.replacer'
export type { Replacer } from '@rcp/use.replacer'

const {
  globalReplacerContextValues,
  ReplacerContext,
  useReplacers,
  useReplacedValue,
  ReplacerConsumer,
  ReplacerProvider
} = factory()
export {
  globalReplacerContextValues,
  ReplacerContext,
  useReplacers,
  useReplacedValue,
  ReplacerConsumer,
  ReplacerProvider
}
