export function invariant<T>(value: T, message: string): asserts value {
  if (!value) {
    throw new Error(`Invariant violation: ${message}`);
  }
}
