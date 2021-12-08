/**
 * @file index.ts
 * @author 余聪
 *
 */
import { BehaviorSubject } from 'rxjs'
import React from 'react'
import useUncontrolled from '@rcp/use.uncontrolled'
import shallowEq from 'shallowequal'
import usePersistFn from '@rcp/use.persistfn'

export type UseBehaviorSubjectOpts = Pick<Partial<Parameters<typeof useUncontrolled>[0]>, 'eq'>

export function useStateToSubject<T>(
  [state, setState]: [T, any],
  subject: BehaviorSubject<T>,
  { eq = (a, b) => a === b }: { eq?: UseBehaviorSubjectOpts['eq'] } = {}
) {
  const setStateFn = usePersistFn(setState)
  const stateRef = React.useRef({
    subjectWriting: false,
    setStating: false
  })
  const eqFn = usePersistFn(eq)
  React.useLayoutEffect(() => {
    if (!eqFn(subject.value, state)) {
      if (!stateRef.current.setStating) {
        stateRef.current.subjectWriting = true
        try {
          subject.next(state)
        } finally {
          stateRef.current.subjectWriting = false
        }
      }
    }
  }, [subject, state, eqFn])

  React.useLayoutEffect(() => {
    const sub = subject.subscribe((v) => {
      if (!stateRef.current.subjectWriting) {
        stateRef.current.setStating = true
        try {
          setStateFn(v)
        } finally {
          stateRef.current.setStating = false
        }
      }
    })
    return () => {
      sub.unsubscribe()
    }
  }, [subject, setStateFn])
}

export function createReactBehaviorSubject<T>(initialValue: T, gOpts?: UseBehaviorSubjectOpts) {
  const subject = new BehaviorSubject<T>(initialValue)
  const useSubject = (opts?: UseBehaviorSubjectOpts) => {
    return useBehaviorSubject(subject, { eq: shallowEq, ...gOpts, ...opts })
  }
  return {
    subject,
    useSubject
  }
}

export function useBehaviorSubject<T>(
  subject: BehaviorSubject<T>,
  { eq = (a, b) => a === b }: UseBehaviorSubjectOpts = {}
) {
  const eqFn = usePersistFn(eq)
  const [state, setState] = React.useState(subject.value)

  React.useLayoutEffect(() => {
    const sub = subject.subscribe((v) => {
      if (!eqFn(v, state)) {
        setState(v as any)
      }
    })
    return () => {
      sub.unsubscribe()
    }
  }, [eqFn, subject, setState, state])

  const setStateForSubject = React.useCallback(
    (v) => {
      if (typeof v === 'function') {
        const newState = v(state)
        subject.next(newState)
      } else {
        subject.next(v)
      }
    },
    [state, subject]
  )

  return [state, setStateForSubject as typeof setState]
}
