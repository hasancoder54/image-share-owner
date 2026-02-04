const { MongoClient } = require('mongodb');

// DİKKAT: "cluster0.xxxx" kısmını kendi MongoDB panelinden kopyaladığınla değiştir!
const uri = "mongodb+srv://depolama1:Hasan12345@cluster0.xxxx.mongodb.net/hasan_storage?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await client.connect();
        const db = client.db('hasan_storage');
        const collection = db.collection('images');

        if (req.method === 'GET') {
            const images = await collection.find({}).sort({ _id: -1 }).toArray();
            return res.status(200).json(images);
        }

        if (req.method === 'POST') {
            const { url } = req.body;
            if (!url) return res.status(400).json({ error: 'Link yok' });
            await collection.insertOne({ url, date: new Date() });
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        // Hata olduğunda tam olarak nedenini veritabanından çekip gösterir
        return res.status(500).json({ 
            error: "Bağlantı Hatası", 
            detay: error.message,
            code: error.codeName // Örn: Unauthorized veya AtlasError
        });
    }
}
