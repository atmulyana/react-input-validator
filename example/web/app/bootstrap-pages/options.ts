/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import type {ContextProps} from '@react-input-validator/web';

function InputContainer({children}: {children?: React.ReactNode}) {
    return children;
}

export const contextProps: Partial<ContextProps> = {
    Container: InputContainer,
    errorTextStyle: 'text-danger',
    inputErrorStyle: 'border-danger text-danger',
}