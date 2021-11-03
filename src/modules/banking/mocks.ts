export function getMockConta(override = {}) {
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

export function getMockPessoa(override = {}) {
    return {
        nome: `Joãozinho Pastel`,
        cpf: `846.029.440-43`,
        dataNascimento: `2011-11-11T02:45:53.466Z`,
        ...override
    }
}


export function getRandomMongoId() {
    return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
}

function randomDate(start, end) {
    if (typeof start === 'string') {
        start = new Date(start)
    }

    if (typeof end === 'string') {
        end = new Date(end)
    }
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

export function getMockTransactions(contaId) {

    return [{
            "conta": contaId,
            "valor": 74,
            "dataTransacao": "2011-07-03T16:47:48.104Z"
        }, {
            "conta": contaId,
            "valor": 48,
            "dataTransacao": "2013-11-18T11:45:26.232Z"
        }, {
            "conta": contaId,
            "valor": 86,
            "dataTransacao": "2014-03-16T13:30:53.331Z"
        }, {
            "conta": contaId,
            "valor": 34,
            "dataTransacao": "2015-07-03T16:47:48.104Z"
        }, {
            "conta": contaId,
            "valor": 78,
            "dataTransacao": "2016-11-18T11:45:26.232Z"
        }, {
            "conta": contaId,
            "valor": 65,
            "dataTransacao": "2017-03-16T13:30:53.331Z"
        }]

}
