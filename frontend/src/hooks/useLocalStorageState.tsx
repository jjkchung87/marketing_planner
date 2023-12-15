import React, { useState, useEffect } from 'react';

// Define a generic type T for the state
const useLocalStorageState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
        let value: T;
        try {
            const item = window.localStorage.getItem(key);
            value = item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also save initialValue in case JSON.parse fails
            value = initialValue;
            console.error(`Error reading localStorage key “${key}”: `, error);
        }
        return value;
    });

    useEffect(() => {
        try {
            const serializedState = JSON.stringify(state);
            window.localStorage.setItem(key, serializedState);
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”: `, error);
        }
    }, [key, state]);

    return [state, setState];
};

export default useLocalStorageState;
