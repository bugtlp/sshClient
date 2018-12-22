import { EOL } from 'os';
import { Client, ClientChannel } from 'ssh2';
import { Transform } from 'stream';

import {
  Command,
  GetFileCommand,
  PutFileCommand,
} from './commands';

/**
 * Command invoker.
 *
 * @class Invoker
 */
class Invoker extends Transform {
  static commands: { [x: string]: typeof Command } = {
    get: GetFileCommand,
    put: PutFileCommand,
  };

  constructor (
    private connection: Client,
    private channel: ClientChannel,
  ) {
    super();
    this.on('error', this.onError);
  }

  onError = (err: Error) => {
    this.channel.stderr.push(Buffer.from(err.message));
    this.push(EOL);
  }

  /**
   * Parse input io for command.
   *
   * @param {(string | Buffer)} chunk
   * @param {string} encoding
   * @param {*} callback
   * @memberof Invoker
   */
  // tslint:disable-next-line:function-name
  _transform (chunk: string | Buffer, encoding: string, callback: any) {
    const [cmd, ...args] = chunk.toString().trim().split(' ');
    if (Invoker.commands[cmd] !== undefined) {
      this.executeCommand(cmd, args)
        .then(_ => callback(null, EOL))
        .catch((err) => {
          this.onError(err);
          callback();
        });
    } else {
      callback(null, chunk);
    }
  }

  async executeCommand (cmd: string, args: string[]) {
    // tslint:disable-next-line:variable-name
    const ConcreateCommand = Invoker.commands[cmd];
    const command = new ConcreateCommand(this.connection);
    return command.execute(...args);
  }
}

export default Invoker;
