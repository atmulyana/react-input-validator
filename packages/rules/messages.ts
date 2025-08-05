import { boolean } from "./boolean";

/**
 * https://github.com/atmulyana/react-input-validator
 */
export default {
    asyncFail: 'cannot validate',
    boolean: 'must be either `true` or `false`',
    email: 'invalid email address',
    httpReq: {
        disconnected: "can't connect to server",
        notOk: "server failed to process data",
        invalid: "can't interpret server response",
    },
    integer: 'must be the round number',
    invalid: 'invalid',
    lengthMax: "exceeds the maximum length of ${max}",
    lengthMin: 'the length must be minimum at ${min}',
    max: 'maximum ${max}',
    min: 'minimum ${min}',
    numeric: 'invalid numeric value',
    required: 'required'
};