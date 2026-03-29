/**
 * FRONTEND LOGGER UTILITY
 * 
 * Centralized logging system that respects environment settings.
 * - DEBUG/INFO: Only visible in Development mode.
 * - WARN/ERROR: Visible in both, but can be hooked to external monitoring.
 */

const isDev = import.meta.env.DEV;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const formatMessage = (level: LogLevel, message: string) => {
  const timestamp = new Date().toLocaleTimeString([], { hour12: false });
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

export const logger = {
  /**
   * Technical details only for developers.
   * Silenced in production.
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.debug(formatMessage('debug', message), ...args);
    }
  },

  /**
   * General application flow info.
   * Silenced in production.
   */
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.info(formatMessage('info', message), ...args);
    }
  },

  /**
   * Potential issues that don't break the app.
   * Always visible in console for troubleshooting.
   */
  warn: (message: string, ...args: unknown[]) => {
    console.warn(formatMessage('warn', message), ...args);
  },

  /**
   * Critical failures. 
   * Always visible. Recommended to hook this to Sentry in the future.
   */
  error: (message: string, ...args: unknown[]) => {
    console.error(formatMessage('error', message), ...args);
  }
};

