/**
 * https://github.com/atmulyana/react-input-validator
 */
import messages from '@react-input-validator/rules/messages';
import type {IRule, LangFunction, Nullable, Rules, ValidateParam} from '@react-input-validator/rules/Rule';
import Rule, {isFilled} from '@react-input-validator/rules/Rule';
import {Required, ValidationRuleAsync} from '@react-input-validator/rules';

type TValidateRuleReturn = {
    isValid: true,
    resultValue: any,
} | {
    isValid: false,
    message: string,

};
type ValidateRuleReturn<Async extends boolean> = Async extends true ? Promise<TValidateRuleReturn> : TValidateRuleReturn;
type TParam = Nullable<string> | ValidateParam;

function validateRule<Async extends boolean>(
    rule: IRule,
    value: any,
    param: ValidateParam,
    lang: LangFunction,
    isAsync: Async
): ValidateRuleReturn<Async> {
    rule.name = param.name;
    rule.inputValues = param.inputValues;
    const isSingleValue = !Array.isArray(value) || rule.isArrayAsSingle;
    const values: Array<any> = isSingleValue ? [value] : value;
    const resultValues: Array<any> = [];
    function getValue(): TValidateRuleReturn {
        if (rule.isValid) {
            return {
                isValid: true,
                resultValue: isSingleValue ? resultValues[0] : resultValues,
            };
        }
        return {
            isValid: false,
            message: rule.errorMessage?.trim() || lang(messages.invalid),
        };
    }

    function evalRule(): TValidateRuleReturn | undefined {
        if (rule.isValid) {
            resultValues.push(rule.resultValue);
        }
        else {
            return getValue();
        }
    }

    if (isAsync) {
        return new Promise(async (resolve) => {
            for (let val of values) {
                await rule.setValue(val).validate();
                const result = evalRule();
                if (result) {
                    resolve(result);
                    return;
                }
            }
            resolve(getValue());
        }) as ValidateRuleReturn<Async>;
    }
    else {
        for (let val of values) {
            if (rule.setValue(val).validate() instanceof Promise) {
                let errMessage = "Call `validateAsync` to process asynchronous validation.";
                errMessage += ` \`validate\` method of \`${rule.constructor.name}\` rule returns a \`Promise\` object.`
                if (!(rule instanceof ValidationRuleAsync))
                    errMessage += " Also, the rule class doesn't inherit class `ValidationRuleAsync`."
                throw errMessage;
            }
            const result = evalRule();
            if (result) return result as ValidateRuleReturn<Async>;
        }
        return getValue() as ValidateRuleReturn<Async>;
    };
}

function checkRules(
    rules: Rules<any>,
    value: unknown,
    param: ValidateParam,
    lang: LangFunction
): boolean | string | Array<IRule> {
    let arRule: Array<IRule>;
    if (Array.isArray(rules)) {
        arRule = rules;
    }
    else {
        if (rules instanceof Rule) //runtime check
            arRule = [rules];
        else return false;
    }

    const requireds: Required[] = [];
    arRule = arRule.filter(rule => {
        if (rule instanceof Required) {
            requireds.push(rule);
           return false;
        }
        return rule instanceof Rule; //runtime check
    }).sort(
        (rule1: IRule, rule2: IRule) => (
            rule1.priority < rule2.priority ? -1 :
            rule1.priority > rule2.priority ? 1 :
            0
        )
    );

    let requiredResult: TValidateRuleReturn | undefined;
    for (let req of requireds) {
        requiredResult = validateRule(req, value, param, lang, false);
        if (!requiredResult.isValid) return requiredResult.message;
    }
    
    if (
        (
            requireds.length < 1            //really optional 
            || requiredResult/*.isValid*/   //if the value is empty and valid then it's optional by a condition
        )
        && !isFilled(value)
    ) {
        if (requiredResult?.isValid) param.resultValue = requiredResult.resultValue;
        return true;
    }

    if (arRule.length < 1) {
        if (requiredResult?.isValid) {
            param.resultValue = requiredResult.resultValue;
            return true;
        }
        return false;
    }

    Rule.prototype.lang = lang;
    return arRule;
}


function prepareParam(param: TParam): ValidateParam {
    if (typeof(param) == 'object' && param) return param;
    return {name: param};
}

export function validate(
    value: unknown,
    rules: Rules<any>,
    param?: TParam,
    lang: LangFunction = Rule.defaultLang
): boolean | string {
    param = prepareParam(param);
    let arRule = checkRules(rules, value, param, lang);
    if (!Array.isArray(arRule)) return arRule;

    let val = value;
    for (let rule of arRule) {
        const result = validateRule(rule, val, param, lang, false);
        if (result.isValid) {
            val = result.resultValue;
        }
        else {
            return result.message;
        }
    }
    param.resultValue = val;
    return true;
}


export async function validateAsync(
    value: unknown,
    rules: Rules<any>,
    param?: TParam,
    lang: LangFunction = Rule.defaultLang
): Promise<boolean | string> {
    param = prepareParam(param);
    let arRule = checkRules(rules, value, param, lang);
    if (!Array.isArray(arRule)) return arRule;

    let val = value;
    for (let rule of arRule) {
        const result = await validateRule(rule, val, param, lang, true);
        if (result.isValid) {
            val = result.resultValue;
        }
        else {
            return result.message;
        }
    }
    param.resultValue = val;
    return true;
}
