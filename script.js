// SISTEMA DE NAVEGAÇÃO ENTRE TELAS
function mudarTela(idTela) {
    // Esconde todas as telas
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });
    
    // Mostra a tela solicitada
    document.getElementById(idTela).classList.add('ativa');
    
    // Rola para o topo da nova tela
    window.scrollTo(0, 0);
    
    // Se for para o chat, inicializa as funcionalidades
    if (idTela === 'tela-8') {
        setTimeout(inicializarChat, 100);
    }
}

// FUNCIONALIDADE DO CHAT
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioContext;
let analyser;
let audioStream;

function inicializarChat() {
    const chatInput = document.getElementById('chat-input');
    const recordBtn = document.getElementById('record-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatInput || !recordBtn) return;
    
    // Enviar mensagem ao pressionar Enter
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            enviarMensagem(this.value);
            this.value = '';
        }
    });
    
    // Configurar gravação de áudio
    recordBtn.addEventListener('click', function() {
        if (!isRecording) {
            iniciarGravacao();
        } else {
            pararGravacao();
        }
    });
}

function enviarMensagem(texto) {
    const chatMessages = document.getElementById('chat-messages');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Criar mensagem do usuário
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = 'message sent';
    mensagemDiv.innerHTML = `
        <div class="message-content">
            <div class="message-bubble sent">
                <p>${texto}</p>
            </div>
            <div class="message-status">
                <span class="message-hora">${horaAtual}</span>
                <span class="material-symbols-outlined">done_all</span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(mensagemDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simular resposta do entregador após 2 segundos
    setTimeout(() => {
        const respostas = [
            "Entendido! O entregador já está a caminho.",
            "Perfeito! Vamos atualizar o status do seu pedido.",
            "Obrigado pela informação!",
            "Seu pedido está sendo preparado.",
            "O entregador está na sua região."
        ];
        
        const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
        const horaResposta = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const respostaDiv = document.createElement('div');
        respostaDiv.className = 'message received';
        respostaDiv.innerHTML = `
            <div class="message-foto"></div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>${respostaAleatoria}</p>
                </div>
                <span class="message-hora">${horaResposta}</span>
            </div>
        `;
        
        chatMessages.appendChild(respostaDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2000);
}

async function iniciarGravacao() {
    try {
        const recordBtn = document.getElementById('record-btn');
        
        // Solicitar permissão para usar o microfone
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Configurar MediaRecorder
        mediaRecorder = new MediaRecorder(audioStream);
        audioChunks = [];
        
        // Coletar chunks de áudio
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        // Quando a gravação terminar
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            exibirAudioGravado(audioBlob);
            
            // Parar o stream
            audioStream.getTracks().forEach(track => track.stop());
        };
        
        // Iniciar gravação
        mediaRecorder.start();
        isRecording = true;
        recordBtn.classList.add('gravando');
        recordBtn.innerHTML = '<span class="material-symbols-outlined">stop</span>';
        
    } catch (error) {
        console.error('Erro ao acessar microfone:', error);
        alert('Não foi possível acessar o microfone. Por favor, verifique as permissões.');
    }
}

function pararGravacao() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        const recordBtn = document.getElementById('record-btn');
        recordBtn.classList.remove('gravando');
        recordBtn.innerHTML = '<span class="material-symbols-outlined">mic</span>';
    }
}

function exibirAudioGravado(audioBlob) {
    const chatMessages = document.getElementById('chat-messages');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Criar elemento de mensagem de áudio
    const audioDiv = document.createElement('div');
    audioDiv.className = 'message sent';
    audioDiv.innerHTML = `
        <div class="message-content">
            <div class="message-bubble sent">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined" style="font-size: 16px;">mic</span>
                    <span>Áudio gravado</span>
                    <span class="material-symbols-outlined" style="font-size: 16px; margin-left: auto;">play_arrow</span>
                </div>
            </div>
            <div class="message-status">
                <span class="message-hora">${horaAtual}</span>
                <span class="material-symbols-outlined">done_all</span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(audioDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Adicionar funcionalidade de play ao áudio
    const audioElement = new Audio(URL.createObjectURL(audioBlob));
    const playButton = audioDiv.querySelector('.material-symbols-outlined:last-child');
    
    playButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (audioElement.paused) {
            audioElement.play();
            this.textContent = 'pause';
        } else {
            audioElement.pause();
            this.textContent = 'play_arrow';
        }
    });
    
    // Quando o áudio terminar
    audioElement.onended = function() {
        playButton.textContent = 'play_arrow';
    };
    
    // Simular resposta do entregador após 3 segundos
    setTimeout(() => {
        const horaResposta = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const respostaDiv = document.createElement('div');
        respostaDiv.className = 'message received';
        respostaDiv.innerHTML = `
            <div class="message-foto"></div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>Áudio recebido! Vou verificar isso.</p>
                </div>
                <span class="message-hora">${horaResposta}</span>
            </div>
        `;
        
        chatMessages.appendChild(respostaDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 3000);
}

// TOGGLE VISIBILIDADE DE SENHA
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-visibility')) {
        const btn = e.target.closest('.btn-visibility');
        const input = btn.parentElement.querySelector('input[type="password"], input[type="text"]');
        const icon = btn.querySelector('.material-symbols-outlined');
        
        if (!input || !icon) return;
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility_off';
        }
    }
});

// INICIALIZAÇÃO
window.addEventListener('DOMContentLoaded', function() {
    // Inicializa a primeira tela
    mudarTela('tela-1');
    
    // Configura busca na home
    const buscaHome = document.querySelector('#tela-5 .search-bar input');
    if (buscaHome) {
        buscaHome.addEventListener('input', function(e) {
            console.log('Buscando:', this.value);
        });
    }
    
    // Configura busca na tela de pesquisa
    const buscaPesquisa = document.querySelector('#tela-6 .search-bar input');
    if (buscaPesquisa) {
        buscaPesquisa.addEventListener('input', function(e) {
            console.log('Pesquisando:', this.value);
        });
    }
});

// Fecha gravação se o usuário sair da tela de chat
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isRecording) {
        pararGravacao();
    }
});

// Prevenir comportamento padrão de formulários
document.addEventListener('submit', function(e) {
    e.preventDefault();
});