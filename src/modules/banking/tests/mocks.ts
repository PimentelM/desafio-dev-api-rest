import {Schema} from "mongoose";

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
