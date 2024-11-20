import React, { createContext, useContext } from 'react';
import useStore from './common/store/useStore';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const store = useStore();

    return (
        <StoreContext.Provider value={{ myInfo, setMyInfo }}>
            {children}
        </StoreContext.Provider>
    );
};

export { StoreProvider, StoreContext };