import commander from 'commander';

import { ICredentials } from './interfaces';
import { parseConnectionArg } from './utils';

commander
  .version('1.0.0')
  .command('* [user:password@hostname]')
  .description('connect to ssh server')
  .action((args) => {
    // const arg = 'root:pxtm0222@10.8.0.22';
    const connectionConfig = parseConnectionArg(args);
    const session = createSession(connectionConfig);
  });

function createSession (config: ICredentials) {
  // tslint:disable-next-line:no-console
  console.log(`Connecting to ${config.host}...`);
}

commander.parse(process.argv);
