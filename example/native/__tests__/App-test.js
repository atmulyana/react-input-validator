/**
 * Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
 */

import 'react-native';
import React from 'react';
import App from '../App';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
    renderer.act(() =>{
        renderer.create(<App />);
    });
});
