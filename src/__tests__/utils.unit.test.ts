import { parseConnectionArg } from '../utils';

describe('Connection parser', () => {
  it('should get username, password, host and port', () => {
    const fullConnection: string = 'username:password@host:22';

    expect(parseConnectionArg(fullConnection)).toMatchObject({
      host: 'host',
      password: 'password',
      port: 22,
      username: 'username',
    });
  });

  it('should get default port', () => {
    const connectionWithoutPort = 'username:password@host';

    expect(parseConnectionArg(connectionWithoutPort)).toHaveProperty('port', 22);
  });
});
