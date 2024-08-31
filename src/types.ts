export interface Options {
  file: string;
  silent?: boolean;
  uniqueIpCount: boolean;
  topUrls: number | boolean;
  activeIps: number | boolean;
}

export type ClassProperties<C> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof C as C[K] extends Function ? never : K]: C[K];
};
