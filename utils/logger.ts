type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function currentLevel(): LogLevel {
  const configured = (process.env.LOG_LEVEL || 'info').toLowerCase();
  if (configured === 'debug' || configured === 'info' || configured === 'warn' || configured === 'error') {
    return configured;
  }
  return 'info';
}

function timestamp(): string {
  return new Date().toISOString();
}

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[currentLevel()];
}

function write(level: LogLevel, message: string, meta?: unknown): void {
  if (!shouldLog(level)) {
    return;
  }

  const prefix = `[${timestamp()}] [${level.toUpperCase()}]`;
  if (meta !== undefined) {
    const serialized = typeof meta === 'string' ? meta : JSON.stringify(meta, null, 2);
    // eslint-disable-next-line no-console
    console.log(`${prefix} ${message}\n${serialized}`);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`${prefix} ${message}`);
}

export const logger = {
  debug(message: string, meta?: unknown): void {
    write('debug', message, meta);
  },
  info(message: string, meta?: unknown): void {
    write('info', message, meta);
  },
  warn(message: string, meta?: unknown): void {
    write('warn', message, meta);
  },
  error(message: string, meta?: unknown): void {
    write('error', message, meta);
  },
};
