import { Client } from 'ssh2';
import { Transform } from 'stream';

import Command from './commands';

/**
 * Command invoker.
 *
 * @class Invoker
 */
class Invoker {
  constructor (
    private connection: Client,
    private commands = ['get'],
  ) {}

  /**
   * Create parser transfer stream.
   *
   * @returns
   * @memberof Invoker
   */
  createParser () {
    const stream = new Transform({
      transform: this.parseCommand.bind(this),
    });
    stream.on('error', this.onError);
    return stream;
  }

  onError (err: Error): any {
    // tslint:disable-next-line:no-console
    console.error(err);
  }

  /**
   * Parse input io for command.
   *
   * @param {(string | Buffer)} chunk
   * @param {string} encoding
   * @param {*} callback
   * @memberof Invoker
   */
  parseCommand (chunk: string | Buffer, encoding: string, callback: any) {
    const [cmd, ...args] = chunk.toString().trim().split(' ');
    if (this.commands.includes(cmd)) {
      this.executeCommand(cmd, args)
        .then(result => callback(null, result))
        .catch(err => callback(err));
    } else {
      callback(null, chunk);
    }
  }

  async executeCommand (cmd: string, args: string[]) {
    const command = new Command(this.connection);
    await command.execute(...args);
  }
}

export default Invoker;
