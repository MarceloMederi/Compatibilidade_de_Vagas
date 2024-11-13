// backend/server.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { calculateCompatibility } = require('./utils');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configuração do Multer para fazer o upload dos arquivos PDF
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        // Filtra para aceitar apenas arquivos PDF
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PDF são permitidos!'), false);
        }
    }
}).array('files', 11); // Permite até 11 arquivos

// Rota principal
app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor Node.js de análise de currículos!');
});

// Rota para o upload de arquivos
app.post('/api/upload', (req, res, next) => {
    // Verifica se o número de arquivos enviados é maior que 10
    if (req.files && req.files.length > 10) {
        // Se exceder, retorna erro
        return res.status(400).json({
            error: 'O número máximo de arquivos permitido é 10. Por favor, envie menos arquivos.'
        });
    }
    // Caso contrário, continua o processamento
    next();
}, upload, async (req, res) => {
    try {
        // Verifica se nenhum arquivo foi enviado
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
        }

        // Verifica se a descrição da vaga foi fornecida
        const jobDescription = req.body.jobDescription;
        if (!jobDescription) {
            return res.status(400).json({ error: 'A descrição da vaga é obrigatória' });
        }

        // Processa todos os arquivos e calcula a compatibilidade
        const results = await Promise.all(
            req.files.map(async (file) => {
                try {
                    const compatibility = await calculateCompatibility(file, jobDescription);

                    // Exclui o arquivo após o processamento
                    fs.unlink(path.join(__dirname, 'uploads', file.filename), (err) => {
                        if (err) console.error('Erro ao excluir o arquivo:', err);
                    });

                    // Retorna o nome do arquivo e a compatibilidade
                    return {
                        fileName: file.originalname,
                        job_description_compatibility: compatibility,
                    };
                } catch (err) {
                    // Caso haja erro ao analisar o arquivo
                    console.error(`Erro ao analisar o arquivo ${file.originalname}:`, err);
                    return {
                        fileName: file.originalname,
                        error: `Erro ao analisar o arquivo ${file.originalname}`,
                    };
                }
            })
        );

        // Filtra apenas resultados válidos e ordena do maior para o menor
        const validResults = results.filter(result => !result.error);
        const sortedResults = validResults.sort((a, b) => 
            b.job_description_compatibility - a.job_description_compatibility
        );

        // Inclui os resultados com erro sem alterar a ordem
        const finalResults = sortedResults.concat(results.filter(result => result.error));

        // Retorna os resultados ordenados para o cliente
        res.json({ results: finalResults });
    } catch (error) {
        // Caso ocorra um erro no servidor
        console.error('Erro ao processar o upload:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Inicializa o servidor na porta 5000
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
