const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to receive form data
app.post('/api/rent', (req, res) => {
  const { name, rentUnit, rentMonth } = req.body;
  const nome = name ? name.replace(/[^A-Za-zÀ-ÿ'\-\s]/g, '').replace(/\s+/g, '_') : '';
  const unidade = rentUnit ? rentUnit.replace(/[^A-Za-zÀ-ÿ0-9'\-\s]/g, '').replace(/\s+/g, '_') : '';
  const mes = rentMonth ? rentMonth.replace(/[^\w-]/g, '_') : '';
  const pdfFileName = `Recibo${nome ? '_' + nome : ''}${unidade ? '_' + unidade : ''}${mes ? '_' + mes : ''}.pdf`;
  console.log('Recibo gerado com sucesso', req.body);
  // Here you can add logic to save the data to a file or database
  res.status(201).json({ message: `Recibo gerado com sucesso: ${pdfFileName}` });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
