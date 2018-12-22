import { Client } from 'ssh2';

class Command {
  constructor (protected connection: Client) {}

  async execute (...args: string[]) {
    throw new Error('Method not implemented');
  }
}

export default Command;
