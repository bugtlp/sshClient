
/**
 * Interface of user credential for connection to SSH server.
 *
 * @export
 * @interface ICredentials
 */
export interface ICredentials {
  username: string;
  password?: string;
  host: string;
  port: number;
}

/**
 * Interface of channel to bind session.
 *
 * @interface IChannel
 */
interface IChannel {
  stdin: NodeJS.ReadStream;
  stdout: NodeJS.WriteStream;
  stderr: NodeJS.WriteStream;
}