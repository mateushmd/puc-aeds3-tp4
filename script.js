class Cesto {
    constructor(p, endereco, cestoEl) {
        this.p = p;
        this.endereco = endereco;
        this.quantidade = 0;
        this.elementos = [];
        this.cestoEl = cestoEl;
    }

    inserir(valor) {
        if (this.quantidade === tCesto)
            return false;

        let i = this.quantidade - 1;
        while (i >= 0 && this.elementos[i] > valor) i--;
        this.elementos.splice(i + 1, 0, valor);
        this.quantidade++;
        return true;
    }

    buscar(valor) {
        return this.#buscar(valor, 0, this.quantidade - 1);
    }

    #buscar(valor, esq, dir) {
        let meio = Math.floor((esq + dir) / 2);
        if (esq > dir) return false;
        if (this.elementos[meio] == valor) return true;
        return this.#buscar(valor, esq, meio - 1) || this.#buscar(valor, meio + 1, dir);
    }

    limpar() {
        this.elementos = [];
        this.quantidade = 0;
    }

    definir(valor) {
	if(valor < 1) return -1;
	tCest = valor; 
    }
}

let tItem = 4;
let tCesto = 4;
let tTotal = tCesto * tItem;

const diretorioEl = document.querySelector('#diretorio');
const cestosEl = document.querySelector('#cestos');
const pEl = document.querySelector('#profundidade-global');
const inserirInputEl = document.querySelector('#inserir');
const buscarInputEl = document.querySelector('#buscar');
const cabecalhoItensEl = document.querySelector('#cabecalho-itens');

let diretorio, dElements, cestos, cElements, p;

reset();

document.querySelector('#tamanho-cesto').addEventListener('change', e => {
    if (!parseInt(e.target.value)) return;

    tCesto = parseInt(e.target.value);
    tTotal = tCesto * tItem;

    reset();
    let hEl = document.querySelector('#highlight1');
    if(hEl) hEl.id = '';
    hEl = document.querySelector('#highlight2');
    if(hEl) hEl.id = '';
});

document.querySelector('#inserir-btn').addEventListener('click', () => {
    if (!parseInt(inserirInputEl.value)) return;

    inserir(parseInt(inserirInputEl.value));
    let hEl = document.querySelector('#highlight1');
    if(hEl) hEl.id = '';
    hEl = document.querySelector('#highlight2');
    if(hEl) hEl.id = '';
});

document.querySelector('#buscar-btn').addEventListener('click', () => {
    if(!parseInt(buscarInputEl.value)) return;

    const value = parseInt(buscarInputEl.value);

    if(!buscar(parseInt(buscarInputEl.value))) return;
    
    let h = hash(value);
    dElements[h].id = 'highlight1';
    cElements[diretorio[h]].querySelectorAll('.item-cesto').forEach(el => {
        if(parseInt(el.innerHTML) === value)
        {
            el.id = 'highlight2';
            return;
        }
    });
    
    setTimeout(() => {
        dElements[h].id = ''; 
        cElements[diretorio[h]].querySelectorAll('.item-cesto').forEach(el => {
            if (parseInt(el.innerHTML) === value) {
                el.id = ''; 
            }
        });
    }, 3000);
});

document.querySelector('#reiniciar-btn').addEventListener('click', () => {
    reset();
    let hEl = document.querySelector('#highlight1');
    if(hEl) hEl.id = '';
    hEl = document.querySelector('#highlight2');
    if(hEl) hEl.id = '';
});

function reset() {
    diretorioEl.querySelectorAll('tr').forEach(el => el.remove());
    cestosEl.querySelectorAll('tr').forEach(el => el.remove());

    diretorio = [0];
    dElements = [];
    cestos = [new Cesto(0, 0)];
    cElements = [];
    p = 0;

    dElements.push(criarElementoDiretorio(0));
    cElements.push(criarElementoCesto(0, 0));

    cabecalhoItensEl.colSpan = tCesto;
}

function hash(valor) {
    return valor % (2 ** p);
}

function inserir(valor) {
    if (buscar(valor)) return;

    let idx = hash(valor);
    let cesto = cestos[diretorio[idx]];
    const cEl = cElements[diretorio[idx]];

    if (cesto.inserir(valor)) {
        cEl.querySelector('.qtd-itens').innerHTML = cesto.quantidade;
        const itensEl = cEl.querySelectorAll('.item-cesto');
        itensEl[cesto.quantidade - 1].innerHTML = valor;
        return;
    }

    cesto.p++;
    cEl.querySelector('.profundidade-local').innerHTML = cesto.p;
    let novoCesto = new Cesto(cesto.p, tTotal * (cestos.length - 1));

    cestos.push(novoCesto);
    cElements.push(criarElementoCesto(tTotal * (cestos.length - 1), cesto.p));

    if (cesto.p <= p) {
        for (let i = diretorio.length - 1; i >= 0; i--) {
            if (diretorio[i] === diretorio[idx]) {
                diretorio[i] = cestos.length - 1;
                dElements[i].innerHTML = tTotal * (cestos.length - 1);
                break;
            }
        }
    }
    else {
        let copiaDiretorio = [...diretorio];
        copiaDiretorio[idx] = cestos.length - 1;
        copiaDiretorio.forEach(el => diretorio.push(el));

        let copiaDElements = [];
        dElements.forEach(el => copiaDElements.push(criarElementoDiretorio(el.innerHTML)));
        copiaDElements[idx].innerHTML = tTotal * (cestos.length - 1);
        copiaDElements.forEach(el => dElements.push(el));

        p++;
        pEl.innerHTML = p;
    }

    let elementos = [...cesto.elementos];
    cesto.limpar();
    cEl.querySelectorAll('.item-cesto').forEach(el => el.innerHTML = '');
    elementos.push(valor);

    elementos.forEach(e => inserir(e));
}

function buscar(valor) {
    let idx = hash(valor);
    return cestos[diretorio[idx]].buscar(valor);
}

function reiniciar() {
    diretorio = [0];
    cestos = [new Cesto(0, 0)];
    p = 0;
}

function popular() {
    for (let i = 1; i <= 10; i++) inserir(i);
}

function criarElementoDiretorio(valor) {
    const el = document.createElement('tr');
    el.innerHTML = valor;
    diretorioEl.appendChild(el);
    return el;
}

function criarElementoCesto(endereco, profundidade) {
    const el = document.createElement('tr');

    const colunaEnderecoEl = document.createElement('td');
    colunaEnderecoEl.innerHTML = endereco;
    colunaEnderecoEl.classList.add('endereco');
    el.appendChild(colunaEnderecoEl);

    const colunaProfundidadeEl = document.createElement('td');
    colunaProfundidadeEl.innerHTML = profundidade;
    colunaProfundidadeEl.classList.add('profundidade-local');
    el.appendChild(colunaProfundidadeEl);

    const colunaQuantidadeEl = document.createElement('td');
    colunaQuantidadeEl.innerHTML = 0;
    colunaQuantidadeEl.classList.add('qtd-itens');
    el.appendChild(colunaQuantidadeEl);

    // Um <td> para cada item (dinâmico)
    for (let i = 0; i < tCesto; i++) {
        const colunaItemEl = document.createElement('td');
        colunaItemEl.classList.add('item-cesto');
        el.appendChild(colunaItemEl);
    }

    cestosEl.appendChild(el);

    return el;
}

const mostrar = () => {
    console.log(p);
    console.log(diretorio);
    console.log('\n');
    cestos.forEach(el => {
        console.log(`end = ${el.endereco}\np' = ${el.p}\nqtd = ${el.quantidade}\n${el.elementos}`);
    })
}; 

