import { Client, ConnectConfig } from 'ssh2';

class Session {

  async connect (config: ConnectConfig) {
    const conn = new Client();
    let bannerMessage = '';
    return new Promise((resolve) => {
      conn
        .on('banner', message => bannerMessage = message)
        .on('ready', () => resolve(bannerMessage))
        .connect(config);
    });
  }
}

export default Session;
