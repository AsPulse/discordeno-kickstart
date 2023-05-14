import { bold, cyan, gray, italic, red, yellow } from 'colors';

export enum LogLevels {
  Debug,
  Info,
  Warn,
  Error,
  Fatal,
}

const prefixes = new Map<LogLevels, string>([
  [LogLevels.Debug, 'DEBUG'],
  [LogLevels.Info, 'INFO'],
  [LogLevels.Warn, 'WARN'],
  [LogLevels.Error, 'ERROR'],
  [LogLevels.Fatal, 'FATAL'],
]);

const noColor: (str: string) => string = (msg) => msg;
const colorFunctions = new Map<LogLevels, (str: string) => string>([
  [LogLevels.Debug, gray],
  [LogLevels.Info, cyan],
  [LogLevels.Warn, yellow],
  [LogLevels.Error, (str: string) => red(str)],
  [LogLevels.Fatal, (str: string) => red(bold(italic(str)))],
]);

export type Logger = ReturnType<typeof logger>;
export function logger({
  logLevel = LogLevels.Debug,
  name,
}: {
  logLevel?: LogLevels;
  name?: string;
} = {}) {
  function log(level: LogLevels, ...args: unknown[]) {
    if (level < logLevel) return;

    let color = colorFunctions.get(level);
    if (!color) color = noColor;

    const date = new Date();
    const log = [
      `[${date.toLocaleDateString('ja-jp')} ${
        date.toLocaleTimeString('ja-jp')
      }]`,
      color(prefixes.get(level) || 'DEBUG'),
      name ? `${name} >` : '>',
      ...args,
    ];

    switch (level) {
      case LogLevels.Debug:
        return console.debug(...log);
      case LogLevels.Info:
        return console.info(...log);
      case LogLevels.Warn:
        return console.warn(...log);
      case LogLevels.Error:
        return console.error(...log);
      case LogLevels.Fatal:
        return console.error(...log);
      default:
        return console.log(...log);
    }
  }

  function setLevel(level: LogLevels) {
    logLevel = level;
  }

  function debug(...args: unknown[]) {
    log(LogLevels.Debug, ...args);
  }

  function info(...args: unknown[]) {
    log(LogLevels.Info, ...args);
  }

  function warn(...args: unknown[]) {
    log(LogLevels.Warn, ...args);
  }

  function error(...args: unknown[]) {
    log(LogLevels.Error, ...args);
  }

  function fatal(...args: unknown[]) {
    log(LogLevels.Fatal, ...args);
  }

  return {
    log,
    setLevel,
    debug,
    info,
    warn,
    error,
    fatal,
  };
}
