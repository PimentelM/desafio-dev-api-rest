# Desafio Api REST

Esta é uma API ilustrativa que foi implementada como uma forma de demonstrar em termos gerais qual é o meu estilo de desenvolvimento de no presente momento. 

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)




# Como usar

### Instalação

Para rodar este projeto em seu computador será necessário instalar a versão LTS do Node, encontrada [neste link](https://nodejs.org/en/download/), e em seguida executar os seguintes comandos em seu terminal:


```bash
git clone https://github.com/PimentelM/desafio-dev-api-rest
cd ./desafio-dev-api-rest
npm install --global yarn
yarn install
yarn start
```

Caso prefira utilizar a versão em docker, basta ter em seu computador o Docker instalado e rodar o comando `docker-compose up`


```bash
git clone https://github.com/PimentelM/desafio-dev-api-rest
cd ./desafio-dev-api-rest
docker-compose up
```


No final do proesso, será disponibilizo um servidor HTTP na porta 3000 do localhost.

# Uso

Você poderá utilizar a API através do painel de requisições disponibilizado pelo `Swagger` ( ou um client HTTP de sua preferência), lá também será possível encontrar as especificações de cada endpoint e quais tipos de dados eles aceitam e esperam.

[Imagem do painel]

Uma vez que a API estiver rodando, o painel poderá ser encontrado no seguinte caminho: http://localhost:3000/api







# Sobre a arquitetura escolhida

O sistema está organizado em uma estrutura que favorece bastante a manutenção e estruturação de aplicações monolíticas, onde o código e os diferentes componentes do sistema podem ser reutilizados ou modificados com facilidade.

Considerei fazer a API utilizando apenas o Express.js, porém esta seria minha escolha caso fosse criar um microsserviço, visto que são sistemas menores. Por outro lado, quando se trata de aplicações monolíticas estas tendem a crescer bastante e mais estrutura de código é necessária.

Dividi o sistema em três camadas principais que serão descritas à seguir.

### Camada de API ( Presentation Layer )

Nesta camada, utilizaremos controllers para:
* Fazer toda a interação com e abstração dos diferentes componentes do protocolo HTTP
* Tratar e validar o input do usuário antes de passar para os serviços
* Devolver a resposta no formato apropriado
* Responder com erros apropriados caso o servidor não lide bem com o input do usuário ou caso ele seja inválido.

Todas as requisições que fazem algum tipo de alteração no estado da aplicação, ou no banco de dados, utilizarão o método `POST`, enquanto todas as requisições de consulta utilizarão o método `GET`

### Camada de Serviços ( Business Logic Layer )

Toda a lógica da aplicação será feita na camada de serviços, os serviços possuem acesso à outros serviços através do sistema de injeção de dependencias do NestJS.

### Camada de dados

Esta camada será provida através de models que serão injetados nos serviços sob demanda. Os models são representações das entidades e todas as queries e operações relacionadas ao banco de dados podem ser feitas através deles.


# Sobre as tecnologias escolhidas

Com a intenção de trabalhar com tecnologias que se integram de forma bastante harmônica, utilizaremos a seguinte stack em nosso projeto:

* MongoDB: Banco de dados NoSQL orientado a objetos.
* NestJS: Este é o nosso robusto framework arquitetural para NodeJS.
* Jest: Biblioteca de testes automatizados em Javascript / Typescript.
* Typescript: Linguagem de escolha para o projeto, por possuir suporte à tipagem estática.

O framework escolhido oferece suporte à diversos design patterns, sendo o design pattern mais notável o uso de serviços como abstrações dos diferentes componentes lógicos do sistema.


### Validação de dados nos controllers

Faremos a validação do tipo do dado e da presença de campos obrigatórios.

Utilizaremos a biblioteca `class-validator`  e o recurso de `Pipes` do NestJs para validar o input em nossos controllers.

Requisições com corpo da requisição terão seus dados validados por "validators" definidos em um arquivo separado, eles utilizam os recursos da biblioteca `class-validator` e um pipe de validação global para validadores de classe.

Retornaremos um erro `400 Bad Request` na requisição quando um input não estiver no formato correto.

Class validators serão utilizados para o corpo da requisição em requisições HTTP do tipo `POST`, e Pipes de validação serão utilizados para parâmetros e queries.


### Validação de dados nos Serviços

Por ser uma verificação de regra de negócio, a verificação será feita manualmente, e sempre que algum input for inválido, lançaremos uma Exceção que será captada pelo NestJs e uma resposta apropriada será enviada ao usuário.

Por via de regra usaremos a exceção associada ao código de status HTTP "BadRequest", que já possui um handler nativo do Nest, mas caso seja necessário abstrair totalmente algum serviço da camada de API então a classe do erro seria substituida por uma classe agnóstica e um handler para ela seria criada.



# Testes

Dado o escopo do projeto, criaremos testes end to end para validar os principais pontos da aplicação e alguns testes unitários para ilustrar como seria feita a implementação deles.

Para fazermos os testes unitários será necessário abstrair o acesso à camada de dados através de um design pattern chamado `Repositório`, que será basicamente um provider responsável por trazer e levar os dados para o banco de dados.

De forma ilustrativa faremos isso em apenas dois métodos do serviço conta e usaremos mocks para importar o serviço sem injetar os models do banco de dados dos quais ele depende.

