// frontend/src/components/TriageForm.jsx

import React, { useState } from 'react';

const TriageForm = () => {
    const [files, setFiles] = useState([]); // Mude de um único arquivo para um array
    const [jobDescription, setJobDescription] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files)); // Armazena todos os arquivos selecionados
    };

    const handleDescriptionChange = (event) => {
        setJobDescription(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        if (files.length === 0 || !jobDescription) {
            setError('Por favor, selecione pelo menos um currículo e insira a descrição da vaga.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file); // Adiciona todos os arquivos ao FormData
        });
        formData.append('jobDescription', jobDescription);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro desconhecido');
            }

            const result = await response.json();
            setResults(result);
            setError(null);
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            setError(error.message);
            setResults(null);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="files">Selecionar currículos (PDFs):</label>
                    <input
                        type="file"
                        id="files"
                        accept=".pdf"
                        multiple // Permite seleção de múltiplos arquivos
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="jobDescription">Descrição da Vaga:</label>
                    <textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={handleDescriptionChange}
                        rows="4"
                        required
                        placeholder="Insira a descrição da vaga aqui..."
                    />
                </div>
                <button type="submit">Enviar</button>
            </form>

            {error && (
                <div style={{ color: 'red', marginTop: '20px' }}>
                    <p>{error}</p>
                </div>
            )}

            {results && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Resultados da Análise</h2>
                    {results.results.map((result, index) => (
                        <div key={index}>
                            <p><strong>Arquivo:</strong> {result.fileName}</p>
                            <p>Compatibilidade com a descrição da vaga: {result.job_description_compatibility}%</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TriageForm;
