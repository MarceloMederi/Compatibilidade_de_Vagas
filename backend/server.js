// backend/server.js

const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { calculateCompatibility } = require('./utils');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PDF são permitidos!'), false);
        }
    }
}).array('files', 10);

app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor Node.js de análise de currículos!');
});

app.post('/api/upload', upload, async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
        }

        const jobDescription = req.body.jobDescription;
        if (!jobDescription) {
            return res.status(400).json({ error: 'A descrição da vaga é obrigatória' });
        }

        const results = await Promise.all(
            req.files.map(async (file) => {
                try {
                    const compatibility = await calculateCompatibility(file, jobDescription);

                    fs.unlink(path.join(__dirname, 'uploads', file.filename), (err) => {
                        if (err) console.error('Erro ao excluir o arquivo:', err);
                    });

                    return {
                        fileName: file.originalname,
                        job_description_compatibility: compatibility,
                    };
                } catch (err) {
                    console.error(`Erro ao analisar o arquivo ${file.originalname}:`, err);
                    return {
                        fileName: file.originalname,
                        error: `Erro ao analisar o arquivo ${file.originalname}`
                    };
                }
            })
        );

        res.json({ results });
    } catch (error) {
        console.error('Erro ao processar o upload:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
