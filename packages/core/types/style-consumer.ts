/**
 * https://github.com/atmulyana/react-input-validator
 */
import type {AsyncFailMessage} from './constant';
import type {InputRef} from './general';
import type {LangFunction, Nullable, Rules} from './rule';
type TAsyncFailMessage = typeof AsyncFailMessage;

export interface ContextDefaultProps<StyleProps> {
    asyncFailMessage: TAsyncFailMessage[keyof TAsyncFailMessage],
    auto: boolean,
    Container: React.ComponentType<{style?: StyleProps, children?: React.ReactNode}>,
    ErrorText: React.ComponentType<{
        style?: [
            StyleProps | undefined,
            StyleProps | undefined,
        ] | StyleProps,
        children?: React.ReactNode,
    }>,
    errorTextStyle: StyleProps,
    focusOnInvalid: boolean,
    inputErrorStyle: StyleProps,
    lang: LangFunction,
};

export interface ContextProps<StyleProps> extends ContextDefaultProps<StyleProps> {
    children: React.ReactNode,
};

export interface ContextValue<StyleProps> extends ContextDefaultProps<StyleProps> {
    readonly nextIndex: number,
    addRef: (ref: InputRef) => any,
    removeRef: (ref: InputRef) => any,
};

export type ValidationOption<Props, StyleProps, OuterProps = Props, CompositeStyleProps = StyleProps, Value = unknown> = {
    asyncFailMessage?: ContextValue<StyleProps>['asyncFailMessage'],
    auto?: boolean,
    Container?: ContextValue<StyleProps>['Container'],
    ErrorText?: ContextValue<StyleProps>['ErrorText'],
    errorTextStyle?: ContextValue<StyleProps>['errorTextStyle'],
    getStyle?: (props: OuterProps) => CompositeStyleProps,
    getValue?: (props: Props) => Value,
    inputErrorStyle?: ContextValue<StyleProps>['inputErrorStyle'],
    lang?: LangFunction,
    name?: string,
    rules:  Rules<Value>,
    setStatusStyle?: (
        props: Props,
        style: Nullable<[StyleProps | undefined, StyleProps | undefined]> | false,
        context: {
            clearValidation: () => void,
            flag: any,
            normalStyle?: StyleProps, 
        }
    ) => React.ReactNode,
    setStyle?: (
        props: Props,
        style?: StyleProps | Array<StyleProps | undefined>,
        container?: {
            style?: StyleProps,
        }
    ) => unknown,
};

export type ValidationProps<StyleProps, CompositeStyleProps = StyleProps, Value = unknown> = 
Pick<
    ValidationOption<any, StyleProps, any, CompositeStyleProps, Value>,
    'auto' | 'Container' | 'ErrorText' | 'errorTextStyle' | 'lang' | 'name' | 'rules'
>
& {
    style?: CompositeStyleProps,
    value: Value | (() => Value),
};