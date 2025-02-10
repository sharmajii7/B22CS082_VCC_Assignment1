const express = require('express'); 
const mongoose = require('mongoose'); 
const app = express(); 
const PORT = process.env. PORT || 3000; 

// Connect to MongoDB (hostel on VM2) 
mongoose.connect('mongodb://198.168.100.5:27017/mydb', { 
        useNewUrlParser: true, 
        useUnified Topology: true 
}).then(() => { 
        console.log('Connected to MongoDB'); 
}).catch(err => { 
        console.error('MongoDB connection error:', err); 
}); 

app.use (express.json()); 

// app.get('/api/hello', (req, res) => { 
//        res.json({message: 'Hello from the backend!' }); 
// }); 

app.get('/api/hello', async (req, res) => { 
        try { 
                const data = await mongoose.connection.db.collection('test').findOne({}); 
                res.json({ message: data.message }); 
        } catch (err) { 
                res.status(500).json({ error: 'Database error' }); 
        } 
}); 

app.listen(PORT, () => { 
        console.log(Service running on port ${PORT}); 
});
