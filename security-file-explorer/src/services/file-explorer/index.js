import {join, dirname} from 'path';
const fs = window.require('fs');
const fsp = fs.promises;

const DEFAULT = 'DEFAULT';

export class FileExplorer {
  constructor({path, disks = []}, chipher) {
    this.chipher = chipher ?? {
      encrypt: (_) => _,
      decrypt: (_) => _,
    };
    this.disks = [DEFAULT, ...disks];
    this.disk = DEFAULT;
    this.path = path;
    this._initDir();
  }

  _initDir() {
    const {path, disks} = this;
    console.dir(disks);
    disks.map((disk) => {
      const diskPath = join(path, disk);
      if (fs.existsSync(diskPath)) return;
      fs.mkdirSync(diskPath, {recursive: true});
    });
    return;
  }

  setDisk(disk) {
    this.disk = disk ?? DEFAULT;
  }

  async getAll(disk = this.disk) {
    const {path} = this;
    console.dir({disk, path});
    const dirents = await fsp.readdir(join(path, disk), {withFileTypes: true});
    const files = await Promise.all(
      dirents.map((dirent) => {
        const res = join(disk, dirent.name);
        if (!dirent.isDirectory()) return res;
        return this.getAll(join(disk, dirent.name));
      }),
    );
    return files.flat();
  }

  // async getAllFiles() {
  //   try {
  //     const {path} = this;
  //     const content = await fsp.readdir(path, {
  //       encoding: 'utf-8',
  //       withFileTypes: true,
  //     });
  //     const files = content.filter((file) => !file.isDirectory()).map(({name}) => name);
  //     return files;
  //   } catch (err) {
  //     console.dir({
  //       message: 'Get all files error',
  //       error: err,
  //     });
  //     throw err;
  //   }
  // }

  async getFile(fileName) {
    try {
      const {path, disk, chipher} = this;
      const filePath = join(path, disk, fileName);
      const file = await fsp.readFile(filePath, {
        encoding: 'utf-8',
      });
      const content = await chipher.decrypt(file);
      return content;
    } catch (err) {
      console.dir({
        message: `Get file ${fileName} error`,
        error: err,
      });
      throw err;
    }
  }

  async saveFile(fileName, content) {
    try {
      const {path, chipher, disk} = this;
      const filePath = join(path, disk, fileName);
      const dir = dirname(filePath);
      await fsp.mkdir(dir, {recursive: true});
      const data = await chipher.encrypt(content);
      await fsp.writeFile(filePath, data, {
        encoding: 'utf-8',
      });
      return true;
    } catch (err) {
      console.dir({
        message: `Save file ${fileName} error`,
        error: err,
      });
      throw err;
    }
  }
}

//Test node.js
// (async () => {
//     try {
//         const FE = new FileExplorer({path: './storage', disks: ['A', 'B']});
//         FE.setDisk('B');
//         await FE.saveFile('aaa/b.txt', 'content');
//         const files = await FE.getAll();
//         console.dir(await FE.getFile('./aaa/b.txt'));
//     } catch(err) {
//         console.dir({
//             message: 'Main error',
//             error: err,
//         });
//     };
// })()
