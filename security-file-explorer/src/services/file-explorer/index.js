import { join } from 'path';
const fs = window.require('fs');
const fsp = fs.promises;

export class FileExplorer {
    constructor({path}, chipher) {
        this.chipher = chipher ?? {
            encrypt: (_) => _,
            decrypt: (_) => _,
        };
        this.path = path;
        this._initDir(path);
    };

    _initDir(path) {
        if(fs.existsSync(path)) return;
        fs.mkdirSync(path, { recursive: true });
        return;
    };

    async getAllFiles() {
        try {
            const { path } = this;
            const content = await fsp.readdir(path, {
                encoding: 'utf-8',
                withFileTypes: true,
            });
            const files = content
                .filter((file) => !file.isDirectory())
                .map(({name}) => name);
            return files;
        } catch(err) {
            console.dir({
                message: 'Get all files error',
                error: err,
            });
            throw err;
        };
    };

    async getFile(fileName) {
        try {
            const { path, chipher } = this;
            const file = await fsp.readFile(join(path, fileName), {
                encoding: 'utf-8',
            });
            const content = await chipher.decrypt(file);
            return content;
        } catch(err) {
            console.dir({
                message: `Get file ${fileName} error`,
                error: err,
            });
            throw err;
        };
    };

    async saveFile(fileName, content) {
        try {
            const { path, chipher } = this;
            const data = await chipher.encrypt(content);
            await fsp.writeFile(join(path, fileName), data, {
                encoding: 'utf-8',
            });
            return true;
        } catch(err) {
            console.dir({
                message: `Save file ${fileName} error`,
                error: err,
            });
            throw err;
        };
    };
};

//Test node.js
// (async () => {
//     try {
//         const FE = new FileExplorer('./');
//         const files = await FE.getAllFiles();
//         console.dir(files);
//         await FE.saveFile('test.txt', JSON.stringify(files));
//         console.dir(await FE.getFile('test.txt'));
//     } catch(err) {
//         console.dir({
//             message: 'Main error',
//             error: err,
//         });
//     };
// })()
