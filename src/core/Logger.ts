import { createWriteStream, WriteStream } from "fs";
import { join } from "path";
import { mkdir } from "fs/promises";

export class Logger {
  private static instance: Logger;
  private logStream: WriteStream;
  private logFilePath: string;

  private constructor() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const logDir = "logs";

    mkdir(logDir, { recursive: true }).catch((err) => {
      process.stderr.write(`Failed to create logs directory: ${err}\n`);
    });

    this.logFilePath = join(logDir, `mcp-server-${timestamp}.log`);
    this.logStream = createWriteStream(this.logFilePath, { flags: "a" });

    process.on("exit", () => this.close());
    process.on("SIGINT", () => this.close());
    process.on("SIGTERM", () => this.close());
  }

  public static getInstance(): Logger {
    try {
      if (!Logger.instance) {
        Logger.instance = new Logger();
      }
      return Logger.instance;
    } catch (error) {
      console.error("Failed to create Logger instance:", error);
      throw error;
    }
   
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string): string {
    return `[${this.getTimestamp()}] [${level}] ${message}\n`;
  }

  public info(message: string): void {
    const formattedMessage = this.formatMessage("INFO", message);
    this.logStream.write(formattedMessage);
    process.stderr.write(formattedMessage);
  }

  public log(message: string): void {
    this.info(message);
  }

  public error(message: string): void {
    const formattedMessage = this.formatMessage("ERROR", message);
    this.logStream.write(formattedMessage);
    process.stderr.write(formattedMessage);
  }

  public warn(message: string): void {
    const formattedMessage = this.formatMessage("WARN", message);
    this.logStream.write(formattedMessage);
    process.stderr.write(formattedMessage);
  }

  public debug(message: string): void {
    const formattedMessage = this.formatMessage("DEBUG", message);
    this.logStream.write(formattedMessage);
    process.stderr.write(formattedMessage);
  }

  public close(): void {
    if (this.logStream) {
      this.logStream.end();
    }
  }

  public getLogPath(): string {
    return this.logFilePath;
  }
}

export const logger = Logger.getInstance();