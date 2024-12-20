// Export config to be accessed by main.js
export const config = {
    BASE_URL: "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com",
    apiKey: null,
};

// export fetchApiKey to be accessed by main.js
export const fetchApiKey = async () => {
    try {
        const response = await fetch(`${config.BASE_URL}/keys`, { method: 'POST' });
        const data = await response.json();
        config.apiKey = data.key;
        return config.apiKey;
    } catch (error) {
        console.error('Error while fetching the API Key:', error);
        alert('Error while fetching the API Key, please try again later!');
    }
};
