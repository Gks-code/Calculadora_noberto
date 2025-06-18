
let alunos = [];
        
let alunoSelecionadoIndex = -1;

/**

 * @param {string} pageId 
 */
function showPage(pageId) {
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
   
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    

    document.getElementById(pageId).classList.add('active');
    

    event.target.classList.add('active');
    
   
    if (pageId === 'home') {
        atualizarEstatisticas();
    } else if (pageId === 'cadastro') {
        listarAlunos();
    } else if (pageId === 'notas') {
        atualizarSelectAlunos();
    } else if (pageId === 'historico') {
        exibirHistorico();
    }
}


function cadastrarAluno() {
    const nome = document.getElementById('nomeAluno').value.trim();
    const frequencia = parseFloat(document.getElementById('frequenciaAluno').value);
    
   
    if (!nome) {
        alert('Por favor, digite o nome do aluno!');
        return;
    }
    
    if (isNaN(frequencia) || frequencia < 0 || frequencia > 100) {
        alert('Por favor, digite uma frequência válida (0-100)!');
        return;
    }
    
 
    if (alunos.some(aluno => aluno.nome.toLowerCase() === nome.toLowerCase())) {
        alert('Já existe um aluno cadastrado com esse nome!');
        return;
    }
    
    const novoAluno = {
        nome: nome,
        frequencia: frequencia,
        notas: [],
        media: 0,
        aprovado: null
    };
    
    alunos.push(novoAluno);
    
    document.getElementById('nomeAluno').value = '';
    document.getElementById('frequenciaAluno').value = '';
    
    listarAlunos();
    
    alert(`Aluno ${nome} cadastrado com sucesso!`);
}
function listarAlunos() {
    const container = document.getElementById('alunosCadastrados');
    
    if (alunos.length === 0) {
        container.innerHTML = '<p>Nenhum aluno cadastrado ainda.</p>';
        return;
    }
    
    let html = '';
    alunos.forEach((aluno, index) => {
        html += `
            <div class="student-card">
                <h4>${aluno.nome}</h4>
                <p><strong>Frequência:</strong> ${aluno.frequencia}%</p>
                <p><strong>Notas:</strong> ${aluno.notas.length > 0 ? aluno.notas.join(', ') : 'Nenhuma nota lançada'}</p>
                ${aluno.media > 0 ? `<p><strong>Média:</strong> ${aluno.media.toFixed(1)}</p>` : ''}
                <button class="btn btn-danger" onclick="removerAluno(${index})">Remover</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Função para remover um aluno
 * @param {number} index - Índice do aluno no vetor
 */
function removerAluno(index) {
    if (confirm(`Deseja realmente remover o aluno ${alunos[index].nome}?`)) {
        alunos.splice(index, 1);
        listarAlunos();
        atualizarSelectAlunos();
    }
}

function atualizarSelectAlunos() {
    const select = document.getElementById('selectAluno');
    select.innerHTML = '<option value="">Selecione um aluno...</option>';
    
    alunos.forEach((aluno, index) => {
        select.innerHTML += `<option value="${index}">${aluno.nome}</option>`;
    });
}


function selecionarAluno() {
    const select = document.getElementById('selectAluno');
    const index = parseInt(select.value);
    
    if (isNaN(index)) {
        document.getElementById('notasContainer').style.display = 'none';
        alunoSelecionadoIndex = -1;
        return;
    }
    
    alunoSelecionadoIndex = index;
    const aluno = alunos[index];
    
    
    document.getElementById('notasContainer').style.display = 'block';
    document.getElementById('nomeAlunoSelecionado').textContent = `Notas de ${aluno.nome}`;
    

    exibirNotasExistentes();
    
  
    document.getElementById('novaNota').value = '';
}

function exibirNotasExistentes() {
    const aluno = alunos[alunoSelecionadoIndex];
    const container = document.getElementById('notasExistentes');
    
    if (aluno.notas.length === 0) {
        container.innerHTML = '<p>Nenhuma nota lançada ainda.</p>';
    } else {
        let html = '<h4>Notas já lançadas:</h4><div class="notes-input">';
        aluno.notas.forEach(nota => {
            html += `<span style="background: #e2e8f0; padding: 8px 15px; border-radius: 6px; font-weight: bold;">${nota}</span>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }
    

    exibirMediaAluno();
}


function adicionarNota() {
    if (alunoSelecionadoIndex === -1) {
        alert('Selecione um aluno primeiro!');
        return;
    }
    
    const nota = parseFloat(document.getElementById('novaNota').value);
    
    if (isNaN(nota) || nota < 0 || nota > 10) {
        alert('Por favor, digite uma nota válida (0-10)!');
        return;
    }
    

    alunos[alunoSelecionadoIndex].notas.push(nota);

    calcularMedia(alunoSelecionadoIndex);

    exibirNotasExistentes();
    
    document.getElementById('novaNota').value = '';
    
    alert(`Nota ${nota} adicionada com sucesso!`);
}

/**
 * Função para calcular a média de um aluno
 * @param {number} index - Índice do aluno no vetor
 */
function calcularMedia(index) {
    const aluno = alunos[index];
    
    if (aluno.notas.length === 0) {
        aluno.media = 0;
        aluno.aprovado = null;
        return;
    }
    
   
    const soma = aluno.notas.reduce((acc, nota) => acc + nota, 0);
    aluno.media = soma / aluno.notas.length;
    
    
    aluno.aprovado = aluno.media >= 6;
}


function exibirMediaAluno() {
    const aluno = alunos[alunoSelecionadoIndex];
    const container = document.getElementById('mediaAluno');
    
    if (aluno.notas.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    const resultClass = aluno.aprovado ? 'aprovado' : 'reprovado';
    const resultText = aluno.aprovado ? 'APROVADO' : 'REPROVADO';
    
    container.innerHTML = `
        <div class="result ${resultClass}">
            Média: ${aluno.media.toFixed(1)} - ${resultText}
        </div>
    `;
}

function exibirHistorico() {
    const container = document.getElementById('historicoContainer');
    
    if (alunos.length === 0) {
        container.innerHTML = '<p>Nenhum aluno cadastrado ainda.</p>';
        return;
    }
    
    let html = '';
    alunos.forEach(aluno => {
        const cardClass = aluno.aprovado === null ? '' : (aluno.aprovado ? '' : 'reprovado');
        const resultClass = aluno.aprovado === null ? '' : (aluno.aprovado ? 'aprovado' : 'reprovado');
        const resultText = aluno.aprovado === null ? 'Sem notas' : (aluno.aprovado ? 'APROVADO' : 'REPROVADO');
        
        html += `
            <div class="student-card ${cardClass}">
                <h3>${aluno.nome}</h3>
                <p><strong>Frequência:</strong> ${aluno.frequencia}%</p>
                <p><strong>Notas:</strong> ${aluno.notas.length > 0 ? aluno.notas.join(', ') : 'Nenhuma nota lançada'}</p>
                ${aluno.notas.length > 0 ? `
                    <p><strong>Média:</strong> ${aluno.media.toFixed(1)}</p>
                    <div class="result ${resultClass}">${resultText}</div>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function atualizarEstatisticas() {
    const totalAlunos = alunos.length;
    let totalAprovados = 0;
    let totalReprovados = 0;
    let somaMedias = 0;
    let alunosComNotas = 0;
    
    alunos.forEach(aluno => {
        if (aluno.aprovado === true) {
            totalAprovados++;
            somaMedias += aluno.media;
            alunosComNotas++;
        } else if (aluno.aprovado === false) {
            totalReprovados++;
            somaMedias += aluno.media;
            alunosComNotas++;
        }
    });
    
    const mediaGeral = alunosComNotas > 0 ? (somaMedias / alunosComNotas) : 0;
    

    document.getElementById('totalAlunos').textContent = totalAlunos;
    document.getElementById('totalAprovados').textContent = totalAprovados;
    document.getElementById('totalReprovados').textContent = totalReprovados;
    document.getElementById('mediaGeral').textContent = mediaGeral.toFixed(1);
}

document.addEventListener('DOMContentLoaded', function() {
    atualizarEstatisticas();
});