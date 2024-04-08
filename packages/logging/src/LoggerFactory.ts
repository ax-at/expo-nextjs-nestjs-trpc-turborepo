import type { Logger } from "pino";
import pino from "pino";

class LoggerFactory {
  static getLogger(name: string): Logger {
    return pino({ name });
  }
}

export default LoggerFactory;
