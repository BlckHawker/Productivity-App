import { useState } from "react";

export function Form(callback: () => void | Promise<void>, initialState = {}) {
    const [values, setValues] = useState<object>(initialState);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValues({...values, [event.target.name]: event.target.value});
    }

    const onSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await callback();
    }
    
        return {
            onChange,
            onSubmit,
            values
        }
}