/**
 * https://github.com/atmulyana/react-input-validator
 */
import Rule, {IRule} from './Rule';

export default class<T, R = any> extends Rule<T, R> {
    async validate(): Promise<IRule<T>> {
        return this;
    }
}