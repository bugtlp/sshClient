
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