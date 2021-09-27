import * as chalk from 'chalk';

export class Logger {
  private static isTestMode: boolean = process.env.NODE_ENV === 'test';

  static info(message: string) {
    if (this.isTestMode) return;
    const now = new Date(Date.now());
    console.log(`[${chalk.cyan('INFO')}]   [${chalk.gray(now.toLocaleString())}] ${message}`);
  }

  static success(message: string) {
    if (this.isTestMode) return;
    const now = new Date(Date.now());
    console.log(`[${chalk.green('SUCCESS')}][${chalk.gray(now.toLocaleString())}] ${message}`);
  }

  static warn(message: string) {
    if (this.isTestMode) return;
    const now = new Date(Date.now());
    console.log(`[${chalk.yellow('WARN')}]   [${chalk.gray(now.toLocaleString())}] ${message}`);
  }

  static error(message: string) {
    if (this.isTestMode) return;
    const now = new Date(Date.now());
    console.log(`[${chalk.red('ERROR')}]  [${chalk.gray(now.toLocaleString())}] ${message}`);
  }

  static query(message: string) {
    if (this.isTestMode) return;
    const now = new Date(Date.now());
    console.log(`[${chalk.yellow('QUERY')}]  [${chalk.gray(now.toLocaleString())}] ${message}`);
  }
}