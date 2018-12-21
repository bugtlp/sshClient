import commander from 'commander';

import { ICredentials } from './interfaces';
import Session from './session';
import { parseConnectionArg, print } from './utils';

commander
  .version('1.0.0')
  .command('* [user:password@hostname]')
  .description('connect to ssh server')
  .action((args) => {
    const connectionConfig = parseConnectionArg(args);
    createSession(connectionConfig);
  });

function createSession (config: ICredentials) {
  const { stdin, stdout, stderr } = process;
  print(`Connecting to ${config.host}...`);
  const session = new Session();
  session
    .connect(config)
    .then(
      (banner) => {
        print(`${banner}`);
        return session.bind({ stderr, stdin, stdout });
      },
      (err: Error) => print(err.message, stderr),
    );
  return session;
}

commander.parse(process.argv);
