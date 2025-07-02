/**
 * https://github.com/atmulyana/react-input-validator
 */
import Rule, {type IRule} from './Rule';

export default class<T, R = any> extends Rule<T, R> {
    validate(): IRule<T> {
        return this;
    }
}