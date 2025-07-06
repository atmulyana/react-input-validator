/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import {
    email,
    required,
} from '@react-input-validator/rules';
import {
    type ContextRef,
    Input,
    ValidationContext,
} from '@react-input-validator/web';

export default function AutoPage() {
    const validation = React.useRef<ContextRef>(null);
    const [isAuto, setAuto] = React.useState(true);

    return <form className='container mx-auto' onSubmit={ev => ev.preventDefault()}>
    <ValidationContext ref={validation} auto={isAuto} focusOnInvalid={true}>
        <h3 className='fs-5 fw-bold lh-sm text-center mb-2'>Auto Validation</h3>
        <div className='mb-3'>Enter the email address to both inputs.</div>

        <div className='row mb-3'>
            <label className='col-3 col-form-label'>
                {isAuto ? 'Auto' : 'Not Auto'}&nbsp;
                <small>(follows the context' setting)</small>
            </label>
            <div className='col-4'>
                <Input type='text' style='form-control' rules={email} />
            </div>
        </div>

        <div className='row mb-3'>
            <label className='col-3 col-form-label'>
                {isAuto ? 'Not Auto' : 'Auto'}&nbsp;
                <small>(input's own setting)</small>
            </label>
            <div className='col-4'>{isAuto
                ? <Input key={1} type='text' style='form-control' rules={[email, required]} settings={{auto: false}} />
                : <Input key={2} type='text' style='form-control' rules={[email, required]} settings={{auto: true}} />
            }</div>
        </div>

        <div className='row'>
            <label className='col-3'>&nbsp;</label>
            <div className='col-8 d-flex'>
                <button type='button' className='btn btn-secondary me-4' onClick={() => setAuto(auto => !auto)}>Switch Auto</button>
                <button className='btn btn-primary me-4' onClick={() => validation.current?.validate()}>Validate</button>
                <button className='btn btn-light'  type='button' onClick={() => validation.current?.clearValidation()}>Clear Validation</button>
            </div>
        </div>
    </ValidationContext>
    </form>;
}