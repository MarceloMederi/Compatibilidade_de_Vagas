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

// Configuração do multer para armazenar arquivos na pasta 'uploads' e permitir múltiplos arquivos
const upload = multer({ dest: 'uploads/' }).array('files', 10); // Limite de até 10 arquivos

// Rota de teste
app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor Node.js de análise de currículos!');
});

// Rota para upload e análise de currículos
app.post('/api/upload', upload, async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
        }

        const jobDescription = req.body.jobDescription;

        const results = await Promise.all(
            req.files.map(async (file) => {
                // Aqui chamamos a função de análise para cada arquivo individualmente
                const compatibility = await calculateCompatibility(file, jobDescription);

                return {
                    fileName: file.originalname,
                    job_description_compatibility: compatibility,
                };
            })
        );

        res.json({ results }); // Retorna os resultados em JSON
    } catch (error) {
        console.error('Erro ao processar o upload:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
