// backend/server.js

const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

        // Função para calcular compatibilidade
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

// Função para calcular a compatibilidade usando Similaridade de Cosseno com TF-IDF
const calculateCompatibility = (resumeText, jobDescriptionText) => {
    const natural = require('natural');
    const tokenizer = new natural.WordTokenizer();

    // Tokenização das palavras
    const resumeWords = tokenizer.tokenize(resumeText);
    const jobDescriptionWords = tokenizer.tokenize(jobDescriptionText);

    // Remoção de stopwords (palavras comuns que não agregam significado)
    const stopWords = natural.stopwords;
    const resumeFiltered = resumeWords.filter(word => !stopWords.includes(word));
    const jobDescriptionFiltered = jobDescriptionWords.filter(word => !stopWords.includes(word));

    // Construção do vocabulário
    const vocabulary = Array.from(new Set([...resumeFiltered, ...jobDescriptionFiltered]));

    // Criação de vetores TF
    const tf = (words) => {
        const termFrequency = {};
        words.forEach(word => {
            termFrequency[word] = (termFrequency[word] || 0) + 1;
        });
        return vocabulary.map(word => termFrequency[word] || 0);
    };

    const tfResume = tf(resumeFiltered);
    const tfJobDescription = tf(jobDescriptionFiltered);

    // Cálculo da similaridade de cosseno
    const similarity = cosineSimilarity(tfResume, tfJobDescription);
    return similarity * 100; // Convertendo para porcentagem
};

// Função para calcular a similaridade de cosseno entre dois vetores
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
};

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
