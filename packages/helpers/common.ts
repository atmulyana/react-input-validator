/**
 * https://github.com/atmulyana/react-input-validator
 */
import {type IRule, isFilled, type Rules, str} from '@react-input-validator/rules/Rule';

export {isFilled, str};
export const red = '#dc3545';

export function arrayAsSingle(rules: Rules, tryNotThrowError: boolean = true) {
    function setArrayAsSingle(rule: IRule) {
        try {
            rule.arrayAsSingle();
        }
        catch(err: any) {
            if (tryNotThrowError) {
                //@ts-ignore
                return new rule.constructor().arrayAsSingle();
            }
            throw err;
        }
        return rule;
    }

    if (Array.isArray(rules)) {
        const rule$: Rules = [rules[0]]; 
        for (let i = 0; i < rules.length; i++) rule$[i] = setArrayAsSingle(rules[i]);
        return rule$;
    }
    else {
        return setArrayAsSingle(rules);
    }
}