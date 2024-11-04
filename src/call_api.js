import dotenv from 'dotenv';
dotenv.config();

const url = 'https://floor-plan-digitalization.p.rapidapi.com/raster-to-vector-raw';

async function callAPI(fileBuffer, filename) {
    const extension = filename.split('.').pop().toLowerCase();
    let mimeType;
    
    switch (extension) {
        case 'png':
            mimeType = 'image/png';
            break;
        case 'jpg':
        case 'jpeg':
            mimeType = 'image/jpeg';
            break;
        case 'gif':
            mimeType = 'image/gif';
            break;
        default:
            throw new Error('Unsupported file type');
    }

    const blob = new Blob([fileBuffer], { type: mimeType });
    
    const data = new FormData();
    data.set('image', blob, filename);

    const options = {  
        method: 'POST',
        headers: {
            'x-rapidapi-key': process.env.RAPID_KEY,
            'x-rapidapi-host': process.env.RAPID_HOST
        },
        body: data
    };

    const response = await fetch(url, options);
    return response.json();
}

export default { callAPI };