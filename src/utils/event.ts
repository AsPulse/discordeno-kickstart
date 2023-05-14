import { EventHandlers } from 'discordeno';
import { bot } from '../bot.ts';
import { logger } from './logger.ts';

const handlers: {
  name: keyof EventHandlers;
  handler: (...args: unknown[]) => void;
}[] = [];

const log = logger({ name: 'event' });
const handle = (name: keyof EventHandlers, args: unknown[]) => {
  const handling = handlers.filter((v) => v.name === name);
  if (handling.length < 1) {
    if (name === 'raw') return;
    if (name === 'dispatchRequirements') return;
    log.debug(`Event '${name}' received, but no handler registered.`);
    return;
  }
  handling.forEach((v) => v.handler(...args));
  log.debug(
    `Event '${name}' received, and handled by ${handling.length} handler(s).`,
  );
};

export function registerEventListener<T extends keyof EventHandlers>(
  event: T,
  handler: EventHandlers[T],
) {
  log.info(`Registered event listener: ${event}`);
  handlers.push({
    name: event,
    handler: handler as (...args: unknown[]) => void,
  });
}

(Object.keys(bot.events) as (keyof EventHandlers)[]).forEach((key) => {
  bot.events[key] = (...args: unknown[]) => handle(key, args);
});
