export default async function handler(req, res) {
    const { tool, query } = req.query;
    
    const API_KEY = process.env.PROPORTAL_KEY || 'my'; 
    
    // Grab Telegram secrets from Vercel Vault safely
    const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
    const TG_CHAT_ID = process.env.TG_CHAT_ID;

    let targetUrl = '';

    switch (tool) {
        case 'number': targetUrl = `https://paid.proportalx.workers.dev/number?key=${API_KEY}&num=${query}`; break;
        case 'vehicle': targetUrl = `https://paid.proportalx.workers.dev/vehicle?key=${API_KEY}&rc=${query}`; break;
        case 'aadhar': targetUrl = `https://paid.proportalx.workers.dev/aadhar?key=${API_KEY}&aadhar=${query}`; break;
        case 'tg': targetUrl = `https://paid.proportalx.workers.dev/tg?key=${API_KEY}&username=${query}`; break;
        case 'family': targetUrl = `https://paid.proportalx.workers.dev/family?key=${API_KEY}&id=${query}`; break;
        case 'ifsc': targetUrl = `https://paid.proportalx.workers.dev/ifsc?key=${API_KEY}&code=${query}`; break;
        case 'ip': targetUrl = `https://paid.proportalx.workers.dev/ip?key=${API_KEY}&ip=${query}`; break;
        case 'pincode': targetUrl = `https://paid.proportalx.workers.dev/pincode?key=${API_KEY}&pincode=${query}`; break;
        case 'gst': targetUrl = `https://paid.proportalx.workers.dev/gst?key=${API_KEY}&gst=${query}`; break;
        case 'email': targetUrl = `https://paid.proportalx.workers.dev/email?key=${API_KEY}&email=${query}`; break;
        default: return res.status(400).json({ error: "Invalid Intelligence Tool Selected" });
    }

    try {
        const fetchResponse = await fetch(targetUrl);
        
        if (!fetchResponse.ok) {
            throw new Error(`Upstream API failed with status: ${fetchResponse.status}`);
        }

        const data = await fetchResponse.json();
        
        // 🚀 SILENT TELEGRAM TRACKER (Runs safely on the Backend)
        if (TG_BOT_TOKEN && TG_CHAT_ID) {
            // Vercel securely provides the user's IP and Device info
            const userIp = req.headers['x-forwarded-for'] || 'Unknown IP';
            const userDevice = req.headers['user-agent'] || 'Unknown Device';
            
            const message = `🚨 *Digit-Hunter Search* 🚨\n\n` +
                            `🔍 *Target:* \`${query}\`\n` +
                            `🛠 *Tool:* ${tool.toUpperCase()}\n\n` +
                            `🌐 *IP:* ${userIp}\n` +
                            `📱 *Device:* \`${userDevice}\``;

            // Fire and forget (won't slow down the user's search)
            fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TG_CHAT_ID, text: message, parse_mode: 'Markdown' })
            }).catch(err => console.error("Telemetry failed silently."));
        }

        res.status(200).json(data);
        
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Intelligence Node Offline or Unreachable." });
    }
}
