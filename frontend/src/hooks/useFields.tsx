import React, { useState, ChangeEvent } from 'react';

// Make the hook generic with a type parameter T
const useFields = <T extends Record<string, any>>(initialState: T): [T, (e: ChangeEvent<HTMLInputElement>) => void, () => void] => {
    const [formData, setFormData] = useState<T>(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData(
            formData => ({
                ...formData,
                [e.target.name]: e.target.value
            })
        );
    };

    const resetFormData = (): void => {
        setFormData(initialState);
    };

    return [formData, handleChange, resetFormData];
};

export default useFields;
