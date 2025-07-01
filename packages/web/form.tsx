/**
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import {extendObject, proxyObject} from 'javascript-common';
import {setRef} from 'reactjs-common';
import type {ContextRef} from "./types";
import {ValidationContext} from './Context';


export const Form = React.forwardRef(function Form(
    {
        children,
        contextProps = {},
        onSubmit,
        ...props

    }: Omit<React.ComponentProps<'form'>, 'noValidate'> & {
        contextProps?: Omit<React.ComponentProps<typeof ValidationContext>, 'ref' | 'key' | 'children'>
    },
    ref: React.Ref<HTMLFormElement & ContextRef>
) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const ctxRef = React.useRef<ContextRef>(null);
    const submitHandler = React.useCallback((ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        ctxRef.current?.validateAsync().then(isValid => {
            if (isValid) {
                if (onSubmit) {
                    let defaultPrevented = false;
                    const event = extendObject(ev, {
                        get defaultPrevented() {
                            return defaultPrevented;
                        },
                        isDefaultPrevented() {
                            return defaultPrevented;
                        },
                        preventDefault() {
                            defaultPrevented = true;
                            ev.preventDefault();
                        },
                    });
                    onSubmit(event);
                    if (event.isDefaultPrevented()) return;
                }
                formRef.current?.submit();
            }
        });
        return false;
    }, [onSubmit]);

    React.useEffect(() => {
        setRef(ref, proxyObject(formRef.current, ctxRef.current));
    }, []);
    
    return <ValidationContext {...contextProps} ref={ctxRef}>
        <form {...props} ref={formRef} onSubmit={submitHandler} noValidate>
            {children}
        </form>
    </ValidationContext>;
});