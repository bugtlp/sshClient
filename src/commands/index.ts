import path from 'path';
import { Client, SFTPWrapper } from 'ssh2';
import { promisify } from 'util';
import { print } from '../utils';

class Command {
  constructor (private connection: Client) {}

  async download (sftp: SFTPWrapper, remotePath: string, localPath: string) {
    print(`Downloading from remoteHost:${remotePath} to 127.0.0.1:${localPath}`);
    const fastGetAsync = promisify<string, string>(sftp.fastGet.bind(sftp));
    try {
      await fastGetAsync(remotePath, localPath);
      print('File is downloaded successfully');
    } finally {
      sftp.end();
    }
  }

  async execute (...args: string[]): Promise<void> {
    const remotePath = args[0];
    const fileName = path.basename(remotePath);
    const localPath = path.join(process.cwd(), fileName);
    const requestSFTP = promisify(this.connection.sftp.bind(this.connection));
    const sftp = await requestSFTP();
    return this.download(sftp, remotePath, localPath);
  }
}

export default Command;
