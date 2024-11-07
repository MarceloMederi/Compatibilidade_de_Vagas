const pdfParse = require('pdf-parse');
const fs = require('fs');

const calculateCompatibility = async (file, jobDescription) => {
    // Ler o arquivo PDF como um buffer
    const dataBuffer = fs.readFileSync(file.path);

    try {
        // Analisar o PDF e extrair texto
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text.toLowerCase();

        // Processar a descrição da vaga
        const jobDescriptionWords = jobDescription.toLowerCase().split(/\s+/);
        const totalWords = jobDescriptionWords.length;
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
        const formattedCompatibility = compatibility.toFixed(2).replace('.', ','); // Aqui formatamos a porcentagem

        return formattedCompatibility; // Retorna a porcentagem formatada
    } catch (error) {
        console.error('Erro ao processar o PDF:', error);
        throw error;
    }
};

module.exports = { calculateCompatibility };
