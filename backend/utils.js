const pdfParse = require('pdf-parse');
const fs = require('fs');

const calculateCompatibility = async (file, jobDescription) => {
    const dataBuffer = fs.readFileSync(file.path);

    try {
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text.toLowerCase();

        const jobDescriptionWords = jobDescription.toLowerCase().split(/\s+/);
        const totalWords = jobDescriptionWords.length;
        let matchedWords = 0;

        jobDescriptionWords.forEach(word => {
            if (resumeText.includes(word)) {
                matchedWords++;
            }
        });

        // Calcular a compatibilidade como um número
        const compatibility = (matchedWords / totalWords) * 100;

        // Retorna o valor numérico sem formatar
        return compatibility;
    } catch (error) {
        console.error('Erro ao processar o PDF:', error);
        throw error;
    }
};

module.exports = { calculateCompatibility };