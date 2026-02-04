const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const client = await connectToDatabase();
        const col = client.db('hasan_storage').collection('images');

        if (req.method === 'GET') {
            const data = await col.find({}).sort({ _id: -1 }).toArray();
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            const { url } = req.body;
            await col.insertOne({ url, date: new Date() });
            return res.status(200).json({ ok: true });
        }

        if (req.method === 'DELETE') {
            const id = req.query.id || req.body.id;
            if (!id) return res.status(400).json({ error: "ID bulunamadı" });

            const result = await col.deleteOne({ _id: new ObjectId(id) });
            return res.status(200).json({ success: result.deletedCount > 0 });
        }
    } catch (e) {
        console.error("Hata:", e);
        return res.status(500).json({ error: e.message });
    }
}
