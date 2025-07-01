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
    validate(resultObj?: Pick<ValidateParam, 'resultValue'>): boolean,
    validateAsync(resultObj?: Pick<ValidateParam, 'resultValue'>): Promise<boolean>,
}

export type AbstractComponent<Props, Instance> = React.ComponentType<React.PropsWithoutRef<Props> & React.RefAttributes<Instance>>
export type ConfigProps<Props, DefaultProps> = {
    [p in keyof DefaultProps]?: DefaultProps[p];
} & {
    [p in keyof Props as (p extends keyof DefaultProps ? never : p)]: Props[p];
};