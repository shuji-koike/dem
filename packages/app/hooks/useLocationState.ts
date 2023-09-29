import { useLocation } from "react-router"

export function useLocationState<T extends Record<string, unknown>>(
  validate?: (x: unknown) => x is T,
): T {
  const { state } = useLocation()
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  if (!validate) return (state ?? {}) as T
  if (validate?.(state)) return state
  throw new Error()
}
