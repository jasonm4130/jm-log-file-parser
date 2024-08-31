#! /usr/bin/env node
import { Parser } from './classes';
(async () => {
  await new Parser().run();
})();
