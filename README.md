
# 👁️ Controle de Acesso Facial (FaceCheck)

Este é um projeto simples de Controle de Acesso de Funcionários que utiliza **Reconhecimento Facial** diretamente no navegador.

Desenvolvido com **HTML**, **Tailwind CSS** e **JavaScript**, utilizando a biblioteca **face-api.js** (baseada em TensorFlow.js) para processamento biométrico.

## 🚀 Funcionalidades

* **Captura de Vídeo:** Acessa a webcam do usuário para stream de vídeo em tempo real.
* **Deteção Facial:** Identifica a posição de rostos no stream.
* **Registro (Enroll):** Permite cadastrar um novo funcionário, capturando um *descritor facial* e associando a um nome.
* **Autenticação (Check-in):** Compara o rosto atual com os descritores faciais cadastrados, realizando o reconhecimento.
* **Estilização Moderna:** Utiliza **Tailwind CSS** para um layout limpo e responsivo.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
| :--- | :--- |
| **HTML5** | Estrutura principal da aplicação. |
| **Tailwind CSS** | Framework CSS *utility-first* para estilização rápida e moderna. |
| **JavaScript (ES6+)** | Lógica da aplicação, controle da câmera e interação com a biblioteca de ML. |
| **face-api.js** | Biblioteca JavaScript para Detecção e Reconhecimento Facial (utiliza modelos do TensorFlow.js). |

## ⚙️ Como Executar o Projeto

Como este projeto carrega modelos de Machine Learning localmente (`/models`), ele **não pode ser executado diretamente abrindo o `index.html`** no navegador por motivos de segurança (*CORS/Same-Origin Policy*).

Você precisa de um **servidor local** para que os arquivos sejam carregados corretamente.

### Pré-requisitos

1.  **Baixar os Modelos:** Você precisa obter os arquivos de modelos da biblioteca `face-api.js` e colocá-los na pasta `models/` na raiz do projeto.
    * Recomendado: Baixe o zip dos modelos do GitHub oficial do **face-api.js** e use os arquivos: `tiny_face_detector_model`, `face_landmark_68_model`, `face_recognition_model` e `face_expression_model`.
2.  **Instalar um Servidor Local:**

### Opção 1: Extensão Live Server (VS Code)

Se você usa o Visual Studio Code, instale a extensão **Live Server**.

1.  Clique com o botão direito no `index.html`.
2.  Selecione **"Open with Live Server"**.

### Opção 2: Node.js e `http-server`

Se você tem o Node.js instalado:

1.  Instale o pacote `http-server` globalmente:
    ```bash
    npm install -g http-server
    ```
2.  Navegue até a pasta raiz do projeto no seu terminal (`controle-acesso-facial/`).
3.  Execute o servidor:
    ```bash
    http-server
    ```
4.  Abra o endereço fornecido (geralmente `http://127.0.0.1:8080` ou `http://localhost:8080`) no seu navegador.

## 🤝 Uso

1.  **Registro (Enroll):** Clique em **"Registrar Novo Funcionário"**. Olhe para a câmera e digite o nome do funcionário quando solicitado. Isso armazena o *descritor facial* no array `registeredFaces` (apenas na memória do navegador).
2.  **Autenticação (Check-in):** Clique em **"Autenticar"**. O sistema entrará em loop, detectando e tentando reconhecer o rosto. O nome do funcionário cadastrado aparecerá na tela se a similaridade for alta o suficiente.

---

## 💡 Próximos Passos e Melhorias

* **Persistência de Dados:** Atualmente, os cadastros são perdidos ao recarregar a página. Implementar **LocalStorage**, **IndexedDB** ou uma API *backend* para armazenar os descritores faciais de forma permanente.
* **Interface de Usuário (UI):** Melhorar a interface para listar os funcionários cadastrados.
* **Segurança:** Implementar uma etapa de PIN ou senha antes de registrar novos rostos.

---

Este vídeo do YouTube demonstra o reconhecimento facial utilizando JavaScript e a biblioteca `face-api.js`, que é a base da solução proposta para o seu controle de acesso.

[Criando Detecção Facial com JavaScript e Face-api.js](https://www.youtube.com/watch?v=tF36BEoQcyo)


http://googleusercontent.com/youtube_content/0