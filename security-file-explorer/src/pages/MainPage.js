import React from "react";
import { Editor } from "../components/Editor/Editor";
import { ListFiles } from "../components/ListFiles/ListFiles";
import { UserContext } from "../contexts/UserContext";

export const MainPage = () => {
    
    const { setRole } = React.useContext(UserContext);

    const backToAuth = (e) => {
        e.preventDefault();
        setRole('');
        window.location.hash = '/auth'
        return;
    };
    
    return(
        <div className='main-page'>
            <ListFiles/>
            <Editor/>
            <button onClick={backToAuth} className='border' style={{
                height: '95vh',
            }}>{'❮❮'}</button>
        </div>
    );
};