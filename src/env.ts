import { load } from 'dotenv';

await load({
  envPath: '.env',
  export: true,
});

function requireEnv<T>(key: string, converter: (value: string) => T): T {
  const value = Deno.env.get(key);
  if (value === undefined) {
    throw new Error(`Environment variable ${key} not found.`);
  }
  return converter(value);
}

export const env: {
  DISCORD_BOT_TOKEN: string;
  DISCORD_BOT_USERID: bigint;
  DISCORD_GUILDID: bigint;
} = {
  DISCORD_BOT_TOKEN: requireEnv('DISCORD_BOT_TOKEN', (x) => x),
  DISCORD_BOT_USERID: requireEnv(
    'DISCORD_BOT_TOKEN',
    (x) => BigInt(atob(x.split('.')[0])),
  ),
  DISCORD_GUILDID: requireEnv('DISCORD_GUILDID', (x) => BigInt(x)),
};
