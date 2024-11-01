// backend/utils.js

const natural = require('natural');

// Função para calcular a compatibilidade usando Similaridade de Cosseno com TF-IDF
const calculateCompatibility = (resumeText, jobDescriptionText) => {
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

// Exporta as funções
module.exports = { calculateCompatibility, cosineSimilarity };
