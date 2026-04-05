// File: api/fetchData.js
export default async function handler(req, res) {
    // 1. Grab the tool requested and the target data from your frontend
    const { tool, query } = req.query;

    // 2. Fetch your secret API key from Vercel's Environment Variables
    // (If it fails to find the hidden key, it defaults to your current one for safety)
    const API_KEY = process.env.PROPORTAL_KEY || "1kSubscriber";

    // 3. The Routing Dictionary
    const API_ROUTES = {
        'number': `https://paid.proportalx.workers.dev/number?key=${API_KEY}&num=`,
        'vehicle': `https://paid.proportalx.workers.dev/vehicle?key=${API_KEY}&rc=`,
        'aadhar': `https://paid.proportalx.workers.dev/aadhar?key=${API_KEY}&aadhar=`,
        'family': `https://paid.proportalx.workers.dev/family?key=${API_KEY}&id=`,
        'tg': `https://paid.proportalx.workers.dev/tg?key=${API_KEY}&username=`,
        'ifsc': `https://paid.proportalx.workers.dev/ifsc?key=${API_KEY}&code=`,
        'ip': `https://paid.proportalx.workers.dev/ip?key=${API_KEY}&ip=`,
        'pincode': `https://paid.proportalx.workers.dev/pincode?key=${API_KEY}&pincode=`,
        'gst': `https://paid.proportalx.workers.dev/gst?key=${API_KEY}&gst=`
    };

    const baseUrl = API_ROUTES[tool];

    // Security check: Make sure a valid tool was requested
    if (!baseUrl) {
        return res.status(400).json({ error: "Invalid tool or endpoint requested." });
    }

    try {
        // 4. Make the Server-to-Server request (This completely bypasses CORS limitations!)
        const targetUrl = baseUrl + encodeURIComponent(query);
        const response = await fetch(targetUrl);
        
        const data = await response.json();

        // If the API returns a failed response, pass that back
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // 5. Send the clean data back to your frontend UI
        return res.status(200).json(data);

    } catch (error) {
        console.error("Vercel Backend Fetch Error:", error);
        return res.status(500).json({ error: "Failed to connect to the intelligence database." });
    }
}
