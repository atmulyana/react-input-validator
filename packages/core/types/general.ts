/**
 * https://github.com/atmulyana/react-input-validator
 */
import type {ValidateParam} from './rule';

export interface Ref {
    clearValidation(): void,
    readonly isValid: boolean,
    validate(): boolean,
    validateAsync(): Promise<boolean>,
}

export interface ContextRef extends Ref {
    getErrorMessage(name: string): string | void,
    getInput(name: string): InputRef | void,
    refreshMessage(): void,
    setErrorMessage(name: string, message: string): void,
}

export interface InputRef extends Ref {
    focus?: () => unknown,
    getErrorMessage: () => string,
    getValue: () => any,
    readonly index: number,
    readonly name?: string,
    readonly resultValue?: any,
    setErrorMessage(message: string): void,
}

interface ComponentClass<Instace, Props = {}, State = any> extends React.ComponentClass<Props, State> {
    new(
        props: Props,
        context?: any,
    ): Instace;
}

export type AbstractComponent<Props, Instance> = 
    | ComponentClass<Instance, Props>
    | React.FunctionComponent<React.PropsWithoutRef<Props> & React.RefAttributes<Instance>> 
    | React.NamedExoticComponent<React.PropsWithoutRef<Props> & React.RefAttributes<Instance>>;

export type ConfigProps<Props, DefaultProps> = {
    [p in keyof DefaultProps]?: DefaultProps[p];
} & {
    [p in keyof Props as (p extends keyof DefaultProps ? never : p)]: Props[p];
};