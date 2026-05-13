export default async function handler(req, res) {
    const { tool, query } = req.query;
    
    // Grabs your secret API Key from Vercel Environment Variables
    const API_KEY = process.env.PROPORTAL_KEY || 'my'; 

    let targetUrl = '';

    // ROUTING ENGINE: Exact endpoint mapping
    switch (tool) {
        case 'number':
            targetUrl = `https://paid.proportalx.workers.dev/number?key=${API_KEY}&num=${query}`;
            break;
        case 'vehicle':
            targetUrl = `https://paid.proportalx.workers.dev/vehicle?key=${API_KEY}&rc=${query}`;
            break;
        case 'aadhar':
            targetUrl = `https://paid.proportalx.workers.dev/aadhar?key=${API_KEY}&aadhar=${query}`;
            break;
        case 'tg':
            targetUrl = `https://paid.proportalx.workers.dev/tg?key=${API_KEY}&username=${query}`;
            break;
        case 'family':
            targetUrl = `https://paid.proportalx.workers.dev/family?key=${API_KEY}&id=${query}`;
            break;
        case 'ifsc':
            targetUrl = `https://paid.proportalx.workers.dev/ifsc?key=${API_KEY}&code=${query}`;
            break;
        case 'ip':
            targetUrl = `https://paid.proportalx.workers.dev/ip?key=${API_KEY}&ip=${query}`;
            break;
        case 'pincode':
            targetUrl = `https://paid.proportalx.workers.dev/pincode?key=${API_KEY}&pincode=${query}`;
            break;
        case 'gst':
            targetUrl = `https://paid.proportalx.workers.dev/gst?key=${API_KEY}&gst=${query}`;
            break;
        case 'email':
            targetUrl = `https://paid.proportalx.workers.dev/email?key=${API_KEY}&email=${query}`;
            break;
        default:
            return res.status(400).json({ error: "Invalid Intelligence Tool Selected" });
    }

    try {
        const fetchResponse = await fetch(targetUrl);
        
        if (!fetchResponse.ok) {
            throw new Error(`Upstream API failed with status: ${fetchResponse.status}`);
        }

        const data = await fetchResponse.json();
        res.status(200).json(data);
        
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Intelligence Node Offline or Unreachable." });
    }
}
