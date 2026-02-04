const { MongoClient, ObjectId } = require('mongodb');

// Bilgileri .env'den çekiyoruz
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await client.connect();
        const col = client.db('hasan_storage').collection('images');

        if (req.method === 'GET') {
            const data = await col.find({}).sort({ _id: -1 }).toArray();
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            await col.insertOne({ url: req.body.url, date: new Date() });
            return res.status(200).json({ ok: true });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            await col.deleteOne({ _id: new ObjectId(id) });
            return res.status(200).json({ success: true });
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
