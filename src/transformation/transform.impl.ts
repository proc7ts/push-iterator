import type { PushIterator } from '../push-iterator';

export function transformIt$again(state: unknown): boolean {
  return !!state && typeof state === 'object' && !!(state as PushIterator.TransformState).re;
}
