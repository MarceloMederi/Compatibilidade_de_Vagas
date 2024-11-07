// utils.js

const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const calculateCompatibility = async (file, jobDescription) => {
    // Lê o arquivo PDF como um buffer
    const dataBuffer = fs.readFileSync(file.path);

    try {
        // Analisar o PDF e extrair o texto
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text.toLowerCase();

        // Processar a descrição da vaga
        const jobDescriptionWords = jobDescription.toLowerCase().split(/\s+/);
        const totalWords = jobDescriptionWords.length;

        if (totalWords === 0) {
            return '0,00'; // Retorna 0% de compatibilidade se a descrição da vaga estiver vazia
        }

        let matchedWords = 0;

        // Contar as palavras que aparecem no currículo
        jobDescriptionWords.forEach(word => {
            if (resumeText.includes(word)) {
                matchedWords++;
            }
        });

        // Calcular a compatibilidade
        const compatibility = (matchedWords / totalWords) * 100;

        // Formatar a porcentagem com duas casas decimais
        const formattedCompatibility = compatibility.toFixed(2).replace('.', ',');

        return formattedCompatibility; // Retorna a porcentagem formatada
    } catch (error) {
        console.error(`Erro ao processar o arquivo PDF (${file.originalname}):`, error);
        throw error;
    } finally {
        // Remover o arquivo PDF após o processamento, independentemente de sucesso ou erro
        fs.unlink(path.join(__dirname, file.path), (err) => {
            if (err) console.error('Erro ao excluir o arquivo:', err);
        });
    }
};

module.exports = { calculateCompatibility };
