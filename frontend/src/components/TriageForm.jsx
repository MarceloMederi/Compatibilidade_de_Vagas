// frontend/src/components/TriageForm.jsx

import React, { useState } from 'react';

const TriageForm = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDescriptionChange = (event) => {
        setJobDescription(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        if (!file || !jobDescription) {
            setError('Por favor, selecione um currículo e insira a descrição da vaga.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
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
                    <label htmlFor="file">Selecionar currículo (PDF):</label>
                    <input
                        type="file"
                        id="file"
                        accept=".pdf"
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
                    <p>{results.message}</p>
                    <p>Compatibilidade com a descrição da vaga: {results.job_description_compatibility}%</p>
                </div>
            )}
        </div>
    );
};

export default TriageForm;