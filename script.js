const tCesto = int(document.querySelector('#cesto').value);
const tTotal = tCesto * 4; // 4 bytes para armazenar um inteiro

class Cesto 
{
    constructor(p, endereco) 
    {
        this.p = p;
        this.endereco = endereco;
        this.quantidade = 0;
        this.elementos = [];
    }

    inserir(valor)
    { 
        if(this.quantidade === tCesto)
            return false;

        let i = quantidade - 1;
        while(i >= 0 && this.elementos[i] > valor) i--;
        this.elementos.splice(i + 1, 0, valor);
        this.quantidade++;
        return true;
    }

    remover(valor)
    {
        if(this.quantidade === 0)
            return false;

        for(let i = 0; i < this.quantidade; i++)
        {
            if(this.elementos[i] === valor)
            {
                this.elementos.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    buscar(valor)
    {
        return this.#buscar(valor, 0, this.quantidade - 1);
    }

    #buscar(valor, esq, dir)
    {
        let meio = Math.floor((esq + dir) / 2);
        if(esq > dir) return false;
        if(this.elementos[meio] == valor) return true;
        return this.#buscar(valor, esq, meio - 1) || this.#buscar(valor, meio + 1, dir); 
    }

    limpar()
    {
        elementos = [];
        quantidade = 0;
    }
}

let diretorio = [0];
let cestos = [new Cesto(0, 0)];
let p = 0;

function hash(valor)
{
    return valor % (2 ** p);
}

function inserir(valor)
{
    let idx = hash(valor);
    let cesto = cestos[diretorio[idx]];

    if(cesto.inserir(valor))
        return;

    cesto.p++;
    let novoCesto = new Cesto(cesto.p, tTotal * (cestos.length)); 
    cestos.push(novoCesto);

    if(cesto.p <= p)
    {
        for(let i = diretorio.length - 1; i >= 0; i--)
        {
            if(diretorio[i] === diretorio[idx])
                diretorio[i] = cestos.length - 1;
        }
    }
    else
    {
        let copiaDiretorio = [...diretorio];
        copiaDiretorio[idx] = cestos.length - 1;
        diretorio.push(copiaDiretorio);
        p++;
    }

    let elementos = [...cesto.elementos];
    cesto.limpar();
    elementos.push(valor);

    elementos.forEach(e => inserir(e));
}

function remover(valor)
{
    let idx = hash(valor);
    cestos[diretorio[idx]].remover(valor);
}
