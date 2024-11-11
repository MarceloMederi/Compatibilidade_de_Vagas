import React, { useState } from 'react';
import './TriageForm.css';

const TriageForm = () => {
    const [files, setFiles] = useState([]); // Mude de um único arquivo para um array
    const [fileNames, setFileNames] = useState([]); // Novo estado para armazenar os nomes dos arquivos
    const [jobDescription, setJobDescription] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitButtonVisible, setIsSubmitButtonVisible] = useState(true); // Estado para controlar a visibilidade do botão

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files); // Armazena todos os arquivos selecionados
        setFiles(selectedFiles);

        // Atualiza os nomes dos arquivos selecionados
        const names = selectedFiles.map(file => file.name);
        setFileNames(names);

        // Verifica se o número de arquivos excede 10 e esconde o botão de envio
        if (selectedFiles.length > 10) {
            setIsSubmitButtonVisible(false);
        } else {
            setIsSubmitButtonVisible(true);
        }
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

        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData,
        });
        
        try {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erro desconhecido');
            }
            setResults(data);
        } catch (error) {
            setError('Erro no envio ou resposta inválida do servidor');
            console.error('Erro:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <p>Favor selecione ate 10 arquivos PDF para analise</p>
                    <label htmlFor="files">Selecionar currículos (PDFs):</label>
                    <input
                        type="file"
                        id="files"
                        accept=".pdf"
                        multiple // Permite seleção de múltiplos arquivos
                        onChange={handleFileChange}
                        required
                    />
                    {/* Exibe os nomes dos arquivos selecionados */}
                    {fileNames.length > 0 && (
                        <div className="file-names">
                            <p><strong>Arquivos Selecionados:</strong></p>
                            <ul>
                                {fileNames.map((fileName, index) => (
                                    <li key={index}>{fileName}</li>
                                ))}
                            </ul>
                        </div>
                    )}
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
                
                {isSubmitButtonVisible && ( // Condicional para exibir o botão com base na quantidade de arquivos
                    <button type="submit">Enviar</button>
                )}
            </form>

            {error && (
                <div style={{ color: 'red', marginTop: '20px' }}>
                    <p>{error}</p>
                </div>
            )}

            {results && (
                <div className="results-container">
                    <h2>Resultados da Análise</h2>
                    {results.results.map((result, index) => (
                        <div key={index} className="result-item">
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
