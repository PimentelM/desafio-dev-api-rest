export function getMockConta(override = {}){
    return {
        pessoa: `112233445566112233445566`,
        saldo: 1000,
        limiteSaqueDiario: 500,
        flagAtivo: true,
        tipoConta: 1,
        dataCriacao: `2021-10-28T02:45:53.466Z`,
        ...override
    }
}

export  function getMockPessoa(override = {}){
    return {
        nome: `Joãozinho Pastel`,
        cpf: `846.029.440-43`,
        dataNascimento: `2011-11-11T02:45:53.466Z`,
        ...override
    }
}


export function getRandomMongoId(){
    return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
}

function randomDate(start, end) {
    if(typeof start === 'string'){
        start = new Date(start)
    }

    if(typeof end === 'string'){
        end = new Date(end)
    }
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

export function getRandomMockTransactions(contaId, quantity = 6){

    return [...Array(quantity)].map(x => ({
        conta: contaId,
        valor: Math.floor(Math.random() * 100),
        dataTransacao: randomDate(`2010-01-01`, `2021-10-30`)

    })).sort((a, b) => new Date(a.dataTransacao).getTime() - new Date(b.dataTransacao).getTime())

}
