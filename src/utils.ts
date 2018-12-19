import { ICredentials } from './interfaces';

/**
 * Parse connection argument from console.
 * Sample: user:password@host:22.
 *
 * @export
 * @param {string} connectionArg
 * @returns {ICredentials}
 */
export function parseConnectionArg (connectionArg: string): ICredentials {
  const [credentialPart, hostPart] = connectionArg.split('@');
  const [username, password] = credentialPart.split(':');
  const [host, port] = hostPart.split(':');
  return {
    host,
    password,
    username,
    // tslint:disable-next-line:object-literal-sort-keys
    port: +port || 22,
  };
}
