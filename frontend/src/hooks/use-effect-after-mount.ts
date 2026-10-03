import { useEffect, useRef } from "react";

export default function useEffectAfterMount(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    return effect()

    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are passed through from the call site; the caller owns when the deferred effect re-runs (skip-first-render contract)
  }, deps)
}
