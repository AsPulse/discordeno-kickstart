import { resolve } from 'path';
import { logger } from './logger.ts';

export async function loadDirectory(path: string) {
  const log = logger({ name: `fileLoader (${path})` });
  for await (const f of Deno.readDir(path)) {
    if (!f.isFile) continue;
    if (!f.name.endsWith('.ts')) continue;
    await import(resolve(path, f.name));
    log.info(`Loaded file ${f.name}...Done!`);
  }
}
