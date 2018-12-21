import commander from 'commander';

import { ICredentials } from './interfaces';
import Session from './session';
import { parseConnectionArg } from './utils';

commander
  .version('1.0.0')
  .command('* [user:password@hostname]')
  .description('connect to ssh server')
  .action((args) => {
    const connectionConfig = parseConnectionArg(args);
    const session = createSession(connectionConfig);
  });

function createSession (config: ICredentials) {
  // tslint:disable-next-line:no-console
  console.log(`Connecting to ${config.host}...`);
  const session = new Session();
  session
    .connect(config)
    .then(
      (banner) => {
        // tslint:disable-next-line:no-console
        console.log(banner);
        return session.bind({
          stdin: process.stdin,
          stdout: process.stdout,
        });
      },
      // tslint:disable-next-line:no-console
      err => console.error(err),
    );
  return session;
}

commander.parse(process.argv);
