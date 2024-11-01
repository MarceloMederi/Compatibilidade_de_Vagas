// backend/server.js

const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const fs = require('fs');
const { calculateCompatibility } = require('./utils');

const app = express();
const port = 5000;

// Middleware para habilitar CORS
app.use(cors());

// Configuração do multer para armazenar arquivos na pasta 'uploads'
const upload = multer({ dest: 'uploads/' });

// Rota de teste
app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor Node.js de análise de currículos!');
});

// Rota para upload e análise de currículo
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const jobDescription = req.body.jobDescription;
        const filePath = req.file.path;

        // Verifica se o arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
        }

        // Lê o conteúdo do PDF
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        const resumeText = pdfData.text.toLowerCase();
        const jobDescriptionText = jobDescription.toLowerCase();

        // Calcula a compatibilidade usando a função importada
        const compatibility = calculateCompatibility(resumeText, jobDescriptionText);

        // Remove o arquivo após análise para manter a pasta uploads limpa
        fs.unlinkSync(filePath);

        // Retorna o resultado da análise
        res.json({
            message: `Analisando ${req.file.originalname} com base na descrição: "${jobDescription}".`,
            job_description_compatibility: compatibility.toFixed(2) // Compatibilidade em porcentagem
        });
    } catch (error) {
        console.error('Erro ao analisar o currículo:', error);
        res.status(500).json({ error: 'Erro interno ao analisar o currículo.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
