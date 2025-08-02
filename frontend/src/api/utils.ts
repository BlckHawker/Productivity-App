//todo add header comment

const baseUrl = import.meta.env.VITE_BACKEND_URL

//todo add header comment
const getAPICall = async (url: string) => {
    return await fetch(`${baseUrl}${url}`, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        method:  'GET'
    }).then(response => {
        return response.json();

    }).then(json => {
        return json;

    })
        .catch((error) => {
            return error;
        });
};

//todo add header comment
const postAPICall = async (url: string, body: object) => {
    return await fetch(`${baseUrl}${url}`, {
        body:    JSON.stringify(body),
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    }).then(response => {
        return response.json();

    }).then(json => {
        return json;

    })
    .catch((error) => {
        return error;
    });
};

export {
    getAPICall,
    postAPICall
};