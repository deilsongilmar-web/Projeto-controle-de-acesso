const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvasOverlay');
const statusMessage = document.getElementById('statusMessage');
const enrollButton = document.getElementById('enrollButton');
const authButton = document.getElementById('authButton');

// Nomes e descritores faciais de funcionários cadastrados (simulação de um "banco de dados")
let registeredFaces = [];
const labels = ['Deilson', 'Gilmar', 'Outro Funcionario']; 

// 1. Carregar Modelos
async function loadModels() {
    statusMessage.textContent = 'Carregando modelos de IA...';
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    // Carregar o modelo de expressão para demonstração visual
    await faceapi.nets.faceExpressionNet.loadFromUri('/models'); 

    statusMessage.textContent = 'Modelos carregados. Iniciando câmera...';
    startVideo();
}

// 2. Iniciar Câmera
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            statusMessage.textContent = `Erro ao acessar a câmera: ${err}`;
            console.error(err);
        });
}

video.addEventListener('play', () => {
    // Configura o canvas com as dimensões do vídeo
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    statusMessage.textContent = 'Pronto. Escolha uma ação.';

    // Configura o loop de detecção (a cada 100ms)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withFaceExpressions(); // Adiciona expressões para um efeito visual

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Limpa o canvas e desenha
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        
        // Exemplo: desenhar os landmarks e fazer o reconhecimento no loop (apenas para Autenticar)
        if (authButton.dataset.mode === 'active' && registeredFaces.length > 0) {
            recognizeFace(resizedDetections);
        }

    }, 100);
});

// 3. Reconhecimento Facial
function recognizeFace(detections) {
    if (detections.length === 0) return;

    // Criar o FaceMatcher com as faces cadastradas
    const faceMatcher = new faceapi.FaceMatcher(registeredFaces, 0.6); // 0.6 é o limite de similaridade

    detections.forEach(detection => {
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        
        // Desenhar um quadrado com o nome do funcionário
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { 
            label: bestMatch.toString(),
            lineWidth: bestMatch.label !== 'unknown' ? 3 : 1, // Destaque se for conhecido
            boxColor: bestMatch.label !== 'unknown' ? 'green' : 'red'
        });
        drawBox.draw(canvas);

        if (bestMatch.label !== 'unknown') {
            statusMessage.textContent = `✅ Funcionário Autenticado: ${bestMatch.label} (Check-in)`;
            // Lógica de check-in (ex: enviar dados para um backend)
        } else {
            statusMessage.textContent = '❌ Rosto não reconhecido. Tente novamente.';
        }
    });
}

// 4. Função de Registro (Enroll)
enrollButton.addEventListener('click', async () => {
    statusMessage.textContent = 'Aguardando captura... Olhe diretamente para a câmera.';

    // Desabilitar o loop de autenticação
    authButton.dataset.mode = 'inactive';
    
    // Capturar o rosto
    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (detection) {
        let employeeName = prompt('Rosto capturado! Digite o nome do funcionário para registro:');
        if (employeeName && employeeName.trim() !== '') {
            // Cria um LabeledFaceDescriptors para o cadastro
            const newFace = new faceapi.LabeledFaceDescriptors(employeeName, [detection.descriptor]);
            registeredFaces.push(newFace);
            statusMessage.textContent = `✅ Funcionário '${employeeName}' registrado com sucesso! Total: ${registeredFaces.length} cadastros.`;
        } else {
            statusMessage.textContent = 'Registro cancelado. O nome não pode ser vazio.';
        }
    } else {
        statusMessage.textContent = '❌ Rosto não detectado. Tente posicionar melhor.';
    }
});

// 5. Função de Autenticação (Check-in)
authButton.addEventListener('click', () => {
    if (registeredFaces.length === 0) {
        statusMessage.textContent = '⚠️ Nenhum funcionário registrado. Por favor, registre um primeiro.';
        return;
    }

    if (authButton.dataset.mode === 'active') {
        authButton.dataset.mode = 'inactive';
        authButton.textContent = 'Autenticar (Check-in)';
        statusMessage.textContent = 'Modo de Autenticação desativado.';
    } else {
        authButton.dataset.mode = 'active';
        authButton.textContent = 'Modo Autenticação ATIVO (Clique para Desativar)';
        statusMessage.textContent = 'Modo de Autenticação ativado. Olhe para a câmera...';
    }
});

// Inicia o carregamento dos modelos quando a página carrega
loadModels();