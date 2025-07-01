/**
 * https://github.com/atmulyana/react-input-validator
 */
import type {
    ContextProps as GenericContextProps,
    ContextValue as GenericContextValue,
    ValidationOption as GenericValidationOption,
    ValidationProps as GenericValidationProps,
} from "@react-input-validator/core/types/style-consumer";

type Falsy = undefined | null | false | "";
interface RecursiveArray<T> extends Array<T | Array<T> | RecursiveArray<T>> {}
interface AnyInterface {}
export type StyleProp< T = (Readonly<{[p: string]: unknown}> | AnyInterface) > =
    | T
    | RecursiveArray<T | Falsy>
    | Falsy;

export type ContextProps = GenericContextProps<StyleProp>;
export type ContextValue = GenericContextValue<StyleProp>;
export type ValidationOption<Props, Value = unknown> = GenericValidationOption<
    Props,
    StyleProp,
    Props,
    StyleProp,
    Value
>;
export type ValidationProps = GenericValidationProps<StyleProp>;