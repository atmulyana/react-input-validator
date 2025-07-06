/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */
import React from 'react';
import {required} from '@react-input-validator/rules';
import {
    fileExt,
    fileMax,
    fileTotalMax,
    fileType,
} from '@react-input-validator/rules-file';
import {
    type ContextRef,
    Form,
    Input,
} from '@react-input-validator/web';

export default function FileUploadPage() {
    const validation = React.useRef<ContextRef & HTMLFormElement>(null);

    return <Form ref={validation} contextProps={{focusOnInvalid: true}} className='container mx-auto' onSubmit={ev => ev.preventDefault()}>
        <h3 className='fs-5 fw-bold lh-sm text-center mb-3'>File Upload</h3>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Document</label>
            <div className='col-9 d-flex flex-column'>
                <Input type='file' style='form-control'
                    rules={[
                        required,
                        fileExt(['pdf', 'doc', 'docx']),
                        fileMax(50, 'k'),
                    ]}
                />
                <small>
                    Please select a .doc, .docx or .pdf file with maximum size is 50k.
                </small>
            </div>
        </div>

        <div className='row mb-3'>
            <label className='col-2 col-form-label'>Images</label>
            <div className='col-9 d-flex flex-column'>
                <Input type='file' multiple style='form-control'
                    rules={[
                        required,
                        fileType(type => type.startsWith('image/')),
                        fileTotalMax(1, 'M'),
                    ]}
                />
                <small>
                    Please select some images files with maximum total size is 1M.
                </small>
            </div>
        </div>

        <div className='row'>
            <label className='col-2'>&nbsp;</label>
            <div className='col-9 d-flex'>
                <button className='btn btn-primary me-4' onClick={() => validation.current?.validate()}>Validate</button>
                <button className='btn btn-light' type='button' onClick={() => validation.current?.clearValidation()}>Clear Validation</button>
            </div>
        </div>
    </Form>;
}