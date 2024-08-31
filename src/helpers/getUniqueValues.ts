import { Parser, LogProperties } from '../classes';

export function getUniqueValues(
  this: Parser,
  key: keyof LogProperties,
): number {
  const valueSet = new Set<string>();

  for (let i = 0; i < this.logs.length; i++) {
    const log = this.logs[i];

    if (log[key]) {
      valueSet.add(log[key]);
    }
  }

  return valueSet.size || 0;
}
