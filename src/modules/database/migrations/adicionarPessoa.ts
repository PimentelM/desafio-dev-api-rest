import { MongoMigration } from './index';

let pessoa = {
  _id: `112233445566112233445566` as any,
  nome: `Joaozinho da Silva`,
  cpf: `846.029.440-43`,
  dataNascimento: `2011-11-11T02:45:53.466Z`,
};

let migration: MongoMigration = {
  name: 'adicionar.pessoa.31.12.21',
  async condition(db) {
    if (await db.collection(`pessoas`).findOne({ cpf: pessoa.cpf })) {
      return false;
    }

    return true;
  },
  async execute(db) {
    await db.collection(`pessoas`).insertOne(pessoa);

    return true;
  },
};

export default migration;
