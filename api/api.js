const { MongoClient } = require('mongodb');

// SENİN ÖZEL BAĞLANTI LİNKİN
const uri = "mongodb+srv://depolama1:Hasan12345@cluster0.kd7pnb1.mongodb.net/hasan_storage?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export default async function handler(req, res) {
    // CORS Ayarları
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // MongoDB'ye bağlan
        await client.connect();
        const db = client.db('hasan_storage');
        const collection = db.collection('images');

        // GET: Kayıtlı resimleri listele
        if (req.method === 'GET') {
            const images = await collection.find({}).sort({ _id: -1 }).toArray();
            return res.status(200).json(images);
        }

        // POST: Yeni resim linkini kaydet
        if (req.method === 'POST') {
            const { url } = req.body;
            if (!url) return res.status(400).json({ error: 'Resim linki bulunamadı.' });
            
            await collection.insertOne({ 
                url: url, 
                date: new Date().toISOString() 
            });
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        return res.status(500).json({ 
            error: "Bağlantı Hatası", 
            detay: error.message 
        });
    }
}
