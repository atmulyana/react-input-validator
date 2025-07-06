/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';

const Context = React.createContext('');

export function PageContext({
    children,
    title,
}: {
    children: React.ReactNode,
    title: string,
}) {
    return <Context.Provider value={title}>
        {children}
    </Context.Provider>;
}

export function usePage() {
    return React.useContext(Context);
}