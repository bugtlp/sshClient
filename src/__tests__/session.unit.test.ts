import { Client } from 'ssh2';

import Session from '../session';

type MockedClient = Pick<Client, 'on' | 'connect'>;
const mockClient: MockedClient = {
  connect: jest.fn(() => undefined),
  on: jest.fn().mockReturnThis(),
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

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Session', () => {
  const session = new Session();
  const connConfig = {
    host: 'localhost',
    password: 'dev',
    username: 'bonusway',
  };

  it('should connect to ssh server', async () => {
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
  });

});

/*
session = new Session();
const welcomeText = session.connect(connConfig); // connect to ssh server
session.bind(); // bind terminal

session.bind(connection);
*/
