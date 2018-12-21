import { Client } from 'ssh2';

class Command {
  constructor (private connection: Client) {}

  async execute (...args: string[]) {
    // tslint:disable-next-line:no-console
    console.log('command execute with params', args);
    await 'completed!!!\n';
  }
}

export default Command;
