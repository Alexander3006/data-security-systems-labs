import React from 'react';
import {GlobalFileContext} from '../../contexts/GlobalFilesContext';
import './App.css';
import {FileExplorer} from '../../services/file-explorer';
import {Chipher} from '../../services/chipher';
import {chipher_config} from '../../configs/chipher.config';
import {file_explorer_config} from '../../configs/file-explorer.config';
import {DependencyContainer} from '../../contexts/DependencyContainer';
import {UserContext} from '../../contexts/UserContext';
import {HashRouter, Route} from 'react-router-dom';
import {MainPage} from '../../pages/MainPage';
import {AuthPath} from '../../pages/AuthPage';
import {disks, user_config} from '../../configs/permission.config';

function App() {
  //init dependecies
  const chipher = new Chipher(chipher_config);
  const fileExplorer = new FileExplorer({...file_explorer_config, disks}, chipher);
  const [role, setRole] = new React.useState('');
  fileExplorer.setDisk(user_config.spaces[role]);
  const [target_file, set_target_file] = React.useState('');

  return (
    <div className="app">
      <DependencyContainer.Provider
        value={{
          chipher,
          fileExplorer,
        }}
      >
        <UserContext.Provider
          value={{
            role,
            setRole,
          }}
        >
          <GlobalFileContext.Provider
            value={{
              target_file,
              set_target_file,
            }}
          >
            <HashRouter>
              <div>
                <Route path="/main" component={MainPage} />
                <Route path="/" component={AuthPath} />
              </div>
            </HashRouter>
          </GlobalFileContext.Provider>
        </UserContext.Provider>
      </DependencyContainer.Provider>
    </div>
  );
}

export default App;
