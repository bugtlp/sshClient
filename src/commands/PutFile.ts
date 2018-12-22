import path from 'path';
import { SFTPWrapper } from 'ssh2';
import { promisify } from 'util';
import { print } from '../utils';
import Command from './Command';

class PutFileCommand extends Command {

  async upload (sftp: SFTPWrapper, localPath: string, remotePath: string) {
    print(`Uploading 127.0.0.1:${localPath} to remoteHost:${remotePath}`);
    const fastPutAsync = promisify<string, string>(sftp.fastPut.bind(sftp));
    try {
      await fastPutAsync(localPath, remotePath);
      print('File is uploaded successfully');
    } finally {
      sftp.end();
    }
  }

  async getRemoteDir (): Promise<string> {
    const execAsync = promisify(this.connection.exec.bind(this.connection));
    const cmdStream = await execAsync('pwd');
    let answer = '';
    return new Promise((resolve, reject) => {
      cmdStream
        .on('data', (data: Buffer) => {
          answer += data.toString().trim();
        })
        .on('close', () => resolve(answer))
        .stderr.on('data', data => reject(data.toString()));
    });
  }

  async execute (...args: string[]): Promise<void> {
    const localPath = args[0];
    const fileName = path.basename(localPath);
    const remoteDir = await this.getRemoteDir();
    const remotePath = path.join(remoteDir, fileName);
    const requestSFTP = promisify(this.connection.sftp.bind(this.connection));
    const sftp = await requestSFTP();
    return this.upload(sftp, localPath, remotePath);
  }
}

export default PutFileCommand;
