const tItem = 4;
let tCesto = 4;
let tTotal = tCesto * tItem;

const cestosEl = document.querySelector('#diretorio');
const pEl = document.querySelector('#profundidade-global');

document.querySelector('#tamanho-cesto').addEventListener('change', (e) => {
    tCesto = e.target.value;
    tTotal = tCesto * tItem;
});

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
}

let diretorio = [0];
let dElements = [];
let cestos = [new Cesto(0, 0)];
let p = 0;

dElements.push(criarElementoDiretorio(0));

popular();

function hash(valor) {
    return valor % (2 ** p);
}

function inserir(valor) {
    let idx = hash(valor);
    let cesto = cestos[diretorio[idx]];

    if (cesto.inserir(valor))
        return;

    cesto.p++;
    let novoCesto = new Cesto(cesto.p, tTotal * (cestos.length));
    cestos.push(novoCesto);

    if (cesto.p <= p) {
        for (let i = diretorio.length - 1; i >= 0; i--) {
            if (diretorio[i] === diretorio[idx]) {
                diretorio[i] = cestos.length - 1;
                dElements[i].innerHTML = cestos.length - 1;
            }
        }
    }
    else {
        let copiaDiretorio = [...diretorio];
        copiaDiretorio[idx] = cestos.length - 1;
        copiaDiretorio.forEach(el => diretorio.push(el));

        let copiaDElements = [];
        dElements.forEach(el => copiaDElements.push(criarElementoDiretorio(el.innerHTML)));
        copiaDElements[idx].innerHTML = cestos.length - 1;
        copiaDElements.forEach(el => dElements.push(el));

        p++;
        pEl.innerHTML = p;
    }

    let elementos = [...cesto.elementos];
    cesto.limpar();
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
    cestosEl.appendChild(el);
    return el;
}

function criarElementoCesto(endereco) {
    const el = document.createElement('tr');
    const colunaEnderecoEl = document.createElement('td', { class: 'endereco' });
    colunaEnderecoEl.innerHTML = endereco;
    el.appendChild(colunaEnderecoEl);
    el.appendChild(document.createElement('td', { class: 'profundidade-local' }));
    el.appendChild(document.createElement('td', { class: 'qtd-itens' }));

    // Um <td> para cada item (dinâmico)
    for (let i = 0; i < tCesto; i++)
        el.appendChild(document.createElement('td', { class: 'item-cesto' }));

    return el;
}
