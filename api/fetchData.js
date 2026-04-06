export default async function handler(req, res) {
    const { tool, query } = req.query;
    
    // Grabs your secret key from Vercel Environment Variables
    const API_KEY = process.env.PROPORTAL_KEY; 

    if (!API_KEY) {
        return res.status(500).json({ error: "Missing API Key in Vercel settings" });
    }

    let targetUrl = '';

    // Routes the request to the NEW paid endpoints
    switch (tool) {
        case 'number':
            targetUrl = `https://paid.proportalxc.workers.dev/number?key=${API_KEY}&num=${query}`;
            break;
        case 'vehicle':
            targetUrl = `https://paid.proportalxc.workers.dev/vehicle?key=${API_KEY}&rc=${query}`;
            break;
        case 'aadhar':
            targetUrl = `https://paid.proportalxc.workers.dev/aadhar?key=${API_KEY}&uid=${query}`;
            break;
        case 'tg':
            targetUrl = `https://paid.proportalxc.workers.dev/tg?key=${API_KEY}&user=${query}`;
            break;
        case 'family':
            targetUrl = `https://paid.proportalxc.workers.dev/family?key=${API_KEY}&id=${query}`;
            break;
        case 'ifsc':
            targetUrl = `https://paid.proportalxc.workers.dev/ifsc?key=${API_KEY}&code=${query}`;
            break;
        case 'ip':
            targetUrl = `https://paid.proportalxc.workers.dev/ip?key=${API_KEY}&ip=${query}`;
            break;
        case 'pincode':
            targetUrl = `https://paid.proportalxc.workers.dev/pincode?key=${API_KEY}&pin=${query}`;
            break;
        case 'gst':
            targetUrl = `https://paid.proportalxc.workers.dev/gst?key=${API_KEY}&gstin=${query}`;
            break;
        default:
            return res.status(400).json({ error: "Invalid tool selected." });
    }

    try {
        const fetchResponse = await fetch(targetUrl);
        const data = await fetchResponse.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to Provider API" });
    }
}
