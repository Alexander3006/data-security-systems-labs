import React, {useEffect} from 'react';
import {DependencyContainer} from '../../contexts/DependencyContainer';
import {GlobalFileContext} from '../../contexts/GlobalFilesContext';
import {READ, SAVE, user_config} from '../../configs/permission.config';
import {UserContext} from '../../contexts/UserContext';
import './Editor.css';

const {permissions} = user_config;

export const Editor = () => {
  const {fileExplorer} = React.useContext(DependencyContainer);
  const {target_file} = React.useContext(GlobalFileContext);
  const [fileContent, setFileContent] = React.useState('');
  const {role} = React.useContext(UserContext);
  const userPermission = permissions[role] ?? [];

  useEffect(() => {
    if (!userPermission.includes(READ)) return;
    (async () => {
      const content = await fileExplorer.getFile(target_file);
      setFileContent(content);
      console.dir(1);
    })();
  }, [target_file, role]);

  const onChangeContent = (e) => {
    e.preventDefault();
    setFileContent(e.target.value);
  };

  const save = async () => {
    if (!userPermission.includes(SAVE)) {
      alert('Permission denied');
      return;
    }
    await fileExplorer.saveFile(target_file, fileContent);
    alert('File has been saved');
    return;
  };

  return (
    <div className="editor border">
      <textarea
        className="text-editor border"
        type="text"
        value={fileContent}
        onChange={onChangeContent}
      ></textarea>
      <div className="panel-buttons">
        <button className="border" onClick={save}>
          {' '}
          Save{' '}
        </button>
      </div>
    </div>
  );
};
