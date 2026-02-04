const { MongoClient } = require('mongodb');

// MongoDB Bağlantı Linki (Kullanıcı: depolama, Şifre: Hasan12345)
const uri = "mongodb+srv://depolama:Hasan12345@cluster0.mongodb.net/?retryWrites=true&w=majority"; 
const client = new MongoClient(uri);

export default async function handler(req, res) {
    // Vercel'de CORS hatalarını önlemek için header ayarları
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await client.connect();
        const db = client.db('hasan_storage');
        const collection = db.collection('images');

        // GET: Daha önce yüklenenleri getir
        if (req.method === 'GET') {
            const images = await collection.find({}).sort({ _id: -1 }).toArray();
            return res.status(200).json(images);
        }

        // POST: Yeni resim linkini kaydet
        if (req.method === 'POST') {
            const { url } = req.body;
            if (!url) return res.status(400).json({ error: 'URL eksik' });
            
            const result = await collection.insertOne({ 
                url, 
                date: new Date().toISOString() 
            });
            return res.status(200).json({ success: true, id: result.insertedId });
        }
    } catch (error) {
        console.error("Mongo Hatası:", error);
        return res.status(500).json({ error: "Veritabanına bağlanılamadı." });
    } finally {
        // Bağlantıyı açık tutmak performansı artırır ama istersen kapatabilirsin
        // await client.close(); 
    }
}

