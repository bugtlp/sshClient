import { Client } from 'ssh2';
import { ICredentials } from './interfaces';
import Invoker from './invoker';

interface IChannel {
  stdin: any;
  stdout: any;
  stderr: any;
}

class Session {
  private connection: Client | null;

  constructor (connection: Client | null = null) {
    this.connection = connection;
  }

  /**
   * Connect to SSH server.
   *
   * @param {ICredentials} config
   * @returns {Promise<string>}
   * @memberof Session
   */
  async connect (config: ICredentials): Promise<string> {
    const conn = new Client();
    let bannerMessage = '';
    return new Promise((resolve) => {
      conn
        .on('banner', message => bannerMessage = message)
        .on('ready', () => {
          this.connection = conn;
          resolve(bannerMessage);
        })
        .connect(config);
    });
  }

  getConnection () {
    return this.connection;
  }

  /**
   * Bind channel to connection.
   *
   * @param {IChannel} channel
   * @returns {Promise<true>}
   * @memberof Session
   */
  async bind (channel: IChannel): Promise<true> {
    const connection = this.getConnection();
    if (connection === null) {
      throw new Error('Not connected');
    }
    return new Promise((resolve, reject) => {
      connection.shell((err, stream) => {
        if (err) {
          return reject(err);
        }
        const invoker = new Invoker(connection, stream);
        stream.on('close', () => {
          stream.end();
          channel.stdin.unpipe(stream);
          channel.stdin.destroy();
          connection.end();
        });
        stream.pipe(channel.stdout);
        stream.stderr.pipe(channel.stderr);
        channel.stdin
          .pipe(invoker)
          .pipe(stream);
        resolve(true);
      });
    });
  }
}

export default Session;
