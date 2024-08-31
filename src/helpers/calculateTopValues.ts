import { Parser, LogProperties } from '../classes';

export function calculateTopValues(
  this: Parser,
  key: keyof LogProperties,
): string[] {
  // Create a new map to store the count of each value
  const valueCounts = new Map<string, number>();

  // Iterate over each log entry
  for (let i = 0; i < this.logs.length; i++) {
    const log = this.logs[i];

    // If the log entry has a value for the key (e.g., url, ip)
    if (log[key]) {
      // Get the count of the value from the map
      const count = valueCounts.get(log[key]) || 0;

      // Increment the count of the value in the map
      valueCounts.set(log[key], count + 1);
    }
  }

  // Sort the values by count in descending order and return the array values
  return Array.from(valueCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => `${value}`);
}
