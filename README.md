# Compatibilidade_de_Vagas

## Descrição

A Compatibilidade_de_Vagas é uma aplicação que permite analisar currículos em formato PDF com base na descrição de vagas de emprego. A aplicação utiliza **Node.js** com **Express.js** para o backend e **React** com **Vite** para o frontend. O objetivo é calcular a compatibilidade entre a descrição da vaga e as informações contidas no currículo enviado.

## Funcionalidades

- Upload de currículos em PDF.
- Análise de compatibilidade entre o currículo e a descrição da vaga.
- Exibição do percentual de compatibilidade.

## Estrutura do Projeto

```plaintext
├── backend/ 
│   ├── uploads/ # Pasta para armazenar currículos enviados 
│   ├── routes/
│   ├── services/
│   ├── server.js # Configuração do servidor Express 
│   ├── package.json # Dependências e scripts do projeto 
│   └── package-lock.json # Arquivo de bloqueio de dependências 
├── frontend/ 
│   ├── node_modules/ 
│   ├── public/ 
│   ├── index.html 
│   └── src/
│   │   ├── assets/ 
│   │   ├── components/ 
│   │   │   └── TriageForm.jsx 
│   │   ├── App.css 
│   │   ├── App.jsx 
│   │   ├── index.css 
│   │   └── main.jsx
│   ├── gitignore
|   ├── eslint.config.js
|   ├── package-lock.json
|   └── vite.config.js
└── README.md
```

## Pré-requisitos

Certifique-se de ter os seguintes itens instalados em seu sistema:

- **Node.js** (v14 ou superior)
- **npm** (v6 ou superior)

## Instalação

### Backend

1. **Navegue até a pasta `backend`**:

    ```bash
    cd backend
    ```

2. **Inicialize o projeto Node.js** (se ainda não o fez):

    ```bash
    npm init -y
    ```

3. **Instale as dependências**:

    ```bash
    npm install express multer pdf-parse cors natural
    ```

4. **Crie a pasta `uploads`** (caso ainda não exista):

    ```bash
    mkdir uploads
    ```

5. **Crie o arquivo `server.js`** com o conteúdo fornecido anteriormente.

6. **Execute o servidor Express**:

    ```bash
    node server.js
    ```

    O servidor estará rodando em `http://localhost:5000`.

### Frontend

1. **Navegue até a pasta `frontend`**:

    ```bash
    cd frontend
    ```

2. **Crie um projeto React com Vite** (se ainda não o fez):

    ```bash
    npm create vite@latest frontend -- --template react
    cd frontend
    npm install
    ```

3. **Instale as dependências adicionais** (se necessário).

4. **Crie ou atualize o componente `TriageForm.jsx`** com o conteúdo fornecido anteriormente.

5. **Inicie o servidor de desenvolvimento do frontend**:

    ```bash
    npm run dev
    ```

    O frontend estará rodando em `http://localhost:5173/`.

## Uso

1. **Acesse o frontend** no navegador: `http://localhost:5173/`.

2. **Envie um currículo**:
    - Selecione um arquivo PDF.
    - Insira a descrição da vaga no campo correspondente.
    - Clique em "Enviar" para iniciar a análise.

3. **Verifique os resultados**:
    - Após o processamento, a compatibilidade entre o currículo e a descrição da vaga será exibida em porcentagem.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE.txt).

## Contato

Para mais informações, entre em contato com [Seu Nome](mailto:seu-email@dominio.com).

