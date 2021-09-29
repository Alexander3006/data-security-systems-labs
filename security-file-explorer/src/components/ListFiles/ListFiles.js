import './ListFiles.css';
import React, {useContext, useEffect, useState} from 'react';
import {ItemFile} from '../ItemFile/ItemFile';
import {GlobalFileContext} from '../../contexts/GlobalFilesContext';
import {DependencyContainer} from '../../contexts/DependencyContainer';
import {CREATE, READ, user_config} from '../../configs/permission.config';
import {UserContext} from '../../contexts/UserContext';

const {permissions} = user_config;

export const ListFiles = () => {
  const [files, setFiles] = useState([]);
  const [newFileName, setNewFileName] = useState('');
  const {set_target_file} = useContext(GlobalFileContext);
  const {fileExplorer} = useContext(DependencyContainer);
  const {role} = React.useContext(UserContext);
  const userPermission = permissions[role] ?? [];

  useEffect(() => {
    if (!userPermission.includes(READ)) return;
    (async () => {
      const files = (await fileExplorer?.getAllFiles()) ?? [];
      setFiles(files);
    })();
  }, []);

  const onChangeInputNewFile = (e) => {
    e.preventDefault();
    setNewFileName(e.target.value);
  };

  const onDoubleClickCreateFile = async () => {
    if (!userPermission.includes(CREATE)) {
      alert('Permission denied');
      return;
    }
    if (!newFileName.length || files.includes(newFileName)) {
      alert('Invalid file name');
      return;
    }
    await fileExplorer.saveFile(newFileName, `File ${newFileName} has been created`);
    setFiles([...files, newFileName]);
    setNewFileName('');
  };

  return (
    <div className="list-files border">
      {files.map((file, i) => (
        <ItemFile key={i} name={file} onClick={() => set_target_file(file)} />
      ))}
      <div className="item-file" onDoubleClick={onDoubleClickCreateFile}>
        <input
          className="new-file-input"
          type="text"
          onChange={onChangeInputNewFile}
          value={newFileName}
        ></input>
      </div>
    </div>
  );
};
