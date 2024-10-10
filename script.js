let wantedList = [];
let categoriaSelecionada = 'todos';

async function inicio() {
    const response = await fetch('https://api.fbi.gov/wanted/v1/list');
    const data = await response.json();
    wantedList = data.items;
    exibirCartoes(wantedList);
}

function exibirCartoes(lista) {
    const divCards = document.getElementById('divCards');
    divCards.innerHTML = '';

    lista.forEach(item => {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-lg-4', 'mb-4');

        const card = document.createElement('div');
        card.classList.add('card');

        const imgSrc = item.images && item.images[0] ? item.images[0].original : 'https://via.placeholder.com/150';
        const cardImg = `<img src="${imgSrc}" class="card-img-top" alt="${item.title || 'Imagem indisponível'}">`;

        card.innerHTML = `
            ${cardImg}
            <div class="card-body">
              <h5 class="card-title">${item.title || 'No Title Available'}</h5>
              <p class="card-text">${item.description || 'No description available.'}</p>
            </div>
            <div class="card-body">
            <a href="${item.url}" class="card-link" target="_blank" onclick="inserirLog('${item.resultado}', '${item.title}')">Ver mais</a>
            </div>
        `;

        cardCol.appendChild(card);
        divCards.appendChild(cardCol);
    });
}

function filtrarCategoria(categoria, event) {
    categoriaSelecionada = categoria;

    document.querySelectorAll('#listaCategoria .list-group-item').forEach(item => {
        item.classList.remove('active'); 
    });
    event.target.classList.add('active');

    let listaFiltrada = wantedList;

    if (categoria !== 'todos') {
        listaFiltrada = wantedList.filter(item => {
            return item.field_offices && item.field_offices.includes(categoria);
        });
    }

    exibirCartoes(listaFiltrada);
}

function pesquisar() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    let listaFiltrada = wantedList.filter(item => item.title.toLowerCase().includes(searchTerm));

    if (categoriaSelecionada !== 'todos') {
        listaFiltrada = listaFiltrada.filter(item => item.field_offices && item.field_offices.includes(categoriaSelecionada));
    }

    exibirCartoes(listaFiltrada);
}

async function inserirLog(resultado, titulo) {
    await fetch(`https://www.piway.com.br/unoesc/api/inserir/log/428899/fbiAPI/Acessou Pagina/${resultado}`)
        .then(resposta => resposta.json());

    const logsList = document.getElementById('logsList');
    const logItem = document.createElement('li');
    logItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    logItem.textContent = `Acessado: ${titulo}`;
    
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
    deleteButton.textContent = 'Excluir';
    deleteButton.onclick = async function () {
        await ExcluirLog(logItem.dataset.id);
        logsList.removeChild(logItem);
    };
    
    logItem.appendChild(deleteButton);
    logsList.appendChild(logItem);
}

async function ExcluirLog(id) {
    await fetch(`https://www.piway.com.br/unoesc/api/excluir/log/${id}/aluno/428899`)
        .then(resposta => resposta.json());
}


window.onload = inicio;
