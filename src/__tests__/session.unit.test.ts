import { Client } from 'ssh2';
import { Duplex } from 'stream';

import { IChannel } from '../interfaces';
import Session from '../session';

type MockedClient = Pick<Client, 'on' | 'connect' | 'shell'>;
const mockClient: MockedClient = {
  connect: jest.fn(() => undefined),
  on: jest.fn().mockReturnThis(),
  shell: jest.fn(cb => cb(null, new Duplex())),
};

jest.mock('ssh2', () => ({
  Client: jest.fn(() => mockClient),
}));

function getListener (client: MockedClient, name: string) {
  const calls = (client as jest.Mocked<MockedClient>).on.mock.calls;
  const call = calls.find(c => c[0] === name);
  if (call) {
    return call[1];
  }
}

const channel: IChannel = {
  stderr: (new Duplex() as NodeJS.WriteStream),
  stdin: (new Duplex() as NodeJS.ReadStream),
  stdout: (new Duplex() as NodeJS.WriteStream),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Session', () => {
  const connConfig = {
    host: 'localhost',
    password: 'dev',
    port: 22,
    username: 'bonusway',
  };

  it('should connect to ssh server', async () => {
    const session = new Session();
    const welcomeText = 'Welcome to ssh server';

    const connPromise = session.connect(connConfig);

    const bannerCallback = getListener(mockClient, 'banner');
    expect(bannerCallback).toBeDefined();
    bannerCallback(welcomeText);

    const readyCallback = getListener(mockClient, 'ready');
    expect(readyCallback).toBeDefined();
    readyCallback();

    const result = await connPromise;
    expect(result).toBe(welcomeText);
    expect(session.getConnection()).toBe(mockClient);
  });

  it('should not binding if not connected', async () => {
    const session = new Session();
    expect.assertions(1);
    return session.bind(channel)
      .catch((err) => {
        expect(err).toBeInstanceOf(Error);
      });
  });

  describe('connected', () => {
    let connection = new Client();
    let session = new Session(connection);

    beforeEach(() => {
      connection = new Client();
      session = new Session(connection);
    });

    it.skip('should bind failure', async () => {
      const error = new Error('error');
      const promise = session.bind(channel);
      const callback = (mockClient as jest.Mocked<MockedClient>).shell.mock.calls[0][0];
      callback(error);
      try {
        await promise;
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    it.skip('should bind success', async () => {
      const promise = session.bind(channel);
      const callback = (mockClient as jest.Mocked<MockedClient>).shell.mock.calls[0][0];
      callback();
      const result = await promise;
      expect(result).toBe(true);
    });
  });
});
