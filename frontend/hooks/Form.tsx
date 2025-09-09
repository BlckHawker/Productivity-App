import { useState } from "react";

export function Form(callback: any, initialState = {}) {
    const [values, setValues] = useState(initialState);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValues({...values, [event.target.name]: event.target.value});
    }

    const onSubmit =  async(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await callback(); // TODO: may instead be an async function to submit data to the database (will need later)
    }

    return {
        onChange,
        onSubmit,
        values
    }
}