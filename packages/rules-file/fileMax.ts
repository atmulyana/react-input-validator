/**
 * https://github.com/atmulyana/react-input-validator
 */
import type {IRule} from '@react-input-validator/rules';
import messages from './messages';
import FileCheck, {type TUnit} from './FileCheck';

export const fileMax = (max: number, unit?: TUnit) => (
    new FileCheck(
        (files, calculateSize) => {
            const maxSize = calculateSize({size: max, unit});
            for (let file of files) if (file.size > maxSize) return false;
            return true;
        },
        messages.fileMax
    ) as IRule<File | readonly File[]>
);

export const fileTotalMax = (max: number, unit?: TUnit) => (
    new FileCheck(
        (files, calculateSize) => {
            const maxSize = calculateSize({size: max, unit});
            const totalSize = files.reduce(
                (size, file) => size + file.size,
                0
            );
            return totalSize <= maxSize;
        },
        messages.fileTotalMax
    ) as IRule<File | readonly File[]>
);