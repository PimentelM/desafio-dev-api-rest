# Desafio Api REST

Esta é uma API ilustrativa que foi implementada como uma forma de demonstrar em termos gerais qual é o meu estilo de desenvolvimento no presente momento. 

![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)


## Tabela de Conteúdos

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Instruções de uso](#instru%C3%A7%C3%B5es-de-uso)
    - [Instalação](#instala%C3%A7%C3%A3o)
      - [Observações sobre o banco de dados](#observa%C3%A7%C3%B5es-sobre-o-banco-de-dados)
    - [Uso da API](#uso-da-api)
- [Arquitetura](#arquitetura)
    - [Camada de API ( Presentation Layer )](#camada-de-api--presentation-layer-)
    - [Camada de Serviços ( Business Logic Layer )](#camada-de-servi%C3%A7os--business-logic-layer-)
    - [Camada de Repositórios ( Persistence Layer)](#camada-de-reposit%C3%B3rios--persistence-layer)
- [Sobre as tecnologias escolhidas](#sobre-as-tecnologias-escolhidas)
    - [Validação de dados nos controllers](#valida%C3%A7%C3%A3o-de-dados-nos-controllers)
    - [Validação de dados nos serviços](#valida%C3%A7%C3%A3o-de-dados-nos-servi%C3%A7os)
- [Testes](#testes)
- [Estrutura de arquivos](#estrutura-de-arquivos)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Instruções de uso

### Instalação

Para rodar este projeto em seu computador será necessário instalar a versão LTS do Node, encontrada [neste link](https://nodejs.org/en/download/), e em seguida executar os seguintes comandos em seu terminal:


```bash
git clone https://github.com/PimentelM/desafio-dev-api-rest
cd ./desafio-dev-api-rest
npm install --global yarn
yarn install
yarn start
```

Caso prefira utilizar a versão em docker, basta ter em seu computador o Docker instalado e rodar o comando `docker-compose up` na pasta do projeto


```bash
git clone https://github.com/PimentelM/desafio-dev-api-rest
cd ./desafio-dev-api-rest
docker-compose up
```
No final do processo, será disponibilizo um servidor HTTP na porta `3000` do `localhost`.

Caso deseje especificar outra porta, utilize a variável de ambiente `PORT`


#### Observações sobre o banco de dados
Caso deseje especificar a string de conexão com o banco de dados, utilize a variável de ambiente `DB_CONN` seguindo o modelo presente no .env.example. 

Caso a string de conexão não seja especificada o sistema utilizará uma instância in-memory do banco de dados ou a instância provida pelo docker-compose caso ele seja utilizado.
 
### Uso da API

Você poderá utilizar esta API através do painel de requisições disponibilizado pelo `Swagger` ou um client HTTP de sua preferência.

Todas as especificações referentes à API estarão disponíveis no painel do `Swagger` uma vez que a API estiver rodando.

![Swagger](./doc/images/swagger.png)

O Painel poderá ser acessado através do seguinte caminho: `http://<host>:<porta>/api`

Através destas especificações é possível saber:

* Método da requisição 
* Caminho 
* Parâmetros, Queries e Corpo da requisição 
* Corpo da resposta 
* Exemplos


# Arquitetura

O sistema está organizado em uma estrutura que favorece bastante a manutenção e estruturação de aplicações monolíticas, onde o código e os diferentes componentes do sistema podem ser reutilizados ou modificados com facilidade.

Dividi o sistema em três camadas principais que serão descritas à seguir.

### Camada de API ( Presentation Layer )

Nesta camada, utilizaremos controllers para:
* Lidar com as requisições HTTP, traduzindo-as em diferentes campos acessíveis pelos métodos do controller.
* Tratar e validar o input do usuário antes de passar para os serviços
* Devolver a resposta no formato apropriado
* Responder com erros apropriados caso o servidor não lide bem com o input do usuário ou caso ele seja inválido.

Todas as requisições que fazem algum tipo de alteração no estado da aplicação, ou no banco de dados, utilizarão o método `POST`, enquanto todas as requisições de consulta utilizarão o método `GET`

### Camada de Serviços ( Business Logic Layer )

Toda a lógica da aplicação será feita na camada de serviços, os serviços possuem acesso à outros providers através do sistema de injeção de dependencias do NestJS.

### Camada de Repositórios ( Persistence Layer)

Usamos esta camada para abstrair o acesso ao banco de dados através de um padrão de design chamado `Repositório`, de forma que poderemos escrever testes unitários para as regras de negócio dos serviços sem termos que instanciar o banco de dados ao mockarmos as dependencias de repositório.

O acesso ao banco de dados será disponibilizado através de models que serão injetados nos repositórios sob demanda. Os models são representações das entidades e todas as queries e operações relacionadas ao banco de dados podem ser feitas através deles.


# Sobre as tecnologias escolhidas

Com a intenção de trabalhar com tecnologias que se integram de forma bastante harmônica, utilizaremos a seguinte stack em nosso projeto:

* MongoDB: Banco de dados NoSQL orientado a objetos.
* NestJS: Este é o nosso robusto framework arquitetural para NodeJS.
* Jest: Biblioteca de testes automatizados em Javascript / Typescript.
* Typescript: Linguagem de escolha para o projeto, por possuir suporte à tipagem estática.

O framework escolhido oferece suporte à diversos design patterns, sendo o mais notável o uso do padrão de Injeção de Dependencia para ligar os serviços e componentes do sistema.


### Validação de dados nos controllers

Faremos a validação do tipo do dado e da presença de campos obrigatórios.

Utilizaremos a biblioteca `class-validator`  e o recurso de `Pipes` do NestJs para validar o input em nossos controllers.

Requisições com corpo da requisição terão seus dados validados por "validators" definidos em um arquivo separado, eles utilizam os recursos da biblioteca `class-validator` e um pipe de validação global para validadores de classe.

Retornaremos um erro `400 Bad Request` na requisição quando um input não estiver no formato correto.

Class validators serão utilizados para o corpo da requisição em requisições HTTP do tipo `POST`, e Pipes de validação serão utilizados para parâmetros e queries.


### Validação de dados nos serviços

Por ser uma verificação de regra de negócio, a verificação será feita com código, tradicionalmente, e sempre que algum input for inválido, lançaremos uma Exceção que será captada pelo NestJs e uma resposta apropriada será enviada ao usuário.

Por via de regra usaremos a exceção associada ao código de status HTTP "BadRequest", que já possui um handler nativo do Nest, mas caso seja necessário abstrair totalmente algum serviço da camada de API então a classe do erro seria substituida por uma classe agnóstica e um handler para ela seria criada.



# Testes

Dado o escopo do projeto, criaremos testes end to end para validar os principais pontos da aplicação e alguns testes unitários para ilustrar como seria feita a implementação deles.

A cobertura dos testes não é 100% e nem cobre todos os casos possíveis, o intúito aqui é ilustrar a implementação de diferentes tipos de testes para registro do estilo de desenvolvimento.

Os testes podem ser encontrados ao lado de seus respectivos controllers // serviços, tendo a seguinte convenção de nomeclatura:

`.e2e.ts`: Testes que testam todas as camadas do sistema ( requer instânciamento de um banco de dados )

`.spec.ts`: Testes unitários ( branch: unit_test_example )


# Estrutura de arquivos

O sistema tem a seguinte organização:

* **./**: Onde ficam os arquivos de configuração principais das tecnologias utilizadas.

* **./doc**: Aqui teremos alguns arquivos de documentação interna à respeito das especificações e requisitos do projeto.

* **./src**: Código fonte do projeto

  * **./modules**: Onde ficam os módulos do sistema.
    * **./database**: Módulo que carrega e executa tarefas associadas ao banco de dados
      * **./models**: As definições de esquema do banco de dados
      * **./migratios**: Define scripts que populam ou modificam o banco de dados.

    * **./banking**: Módulo onde fica o código responsável pela API do sistema de gestão de contas
      * **./\*.controller.ts**: Definições de endpoints
      * **./\*.service.ts**: Regras de negócio 
      * **./\*.\*.e2e-spec.ts**: Testes end-to-end

  * **./pipes**: Onde definimos pipes de validação e transformação

  * **./main.ts**: Entrypoint do projeto

  * **./config.ts**: Arquivo onde podem ser agregadas as variáveis de ambiente

