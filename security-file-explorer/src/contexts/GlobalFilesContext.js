import React from "react";

export const GlobalFileContext = React.createContext({
    target_file: null,
    set_target_file: () => {},
});