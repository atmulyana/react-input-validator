/**
 * https://github.com/atmulyana/react-input-validator
 */
import Rule from './Rule';

export default class<T, R = any> extends Rule<T, R> {
    validate(): Rule<T> {
        return this;
    }
}