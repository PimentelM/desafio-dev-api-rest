# Sobre a arquitetura escolhida

O sistema está organizado em uma estrutura que favorece bastante a manutenção e estruturação de aplicações monolíticas, onde o código e os diferentes componentes do sistema podem ser reutilizados ou modificados com facilidade.

Considerei fazer a API utilizando apenas o Express.js, porém esta seria minha escolha caso fosse criar um microsserviço, visto que são sistemas menores. Por outro lado, quando se trata de aplicações monolíticas estas tendem a crescer bastante e mais estrutura de código é necessária.

Dividi o sistema em três camadas principais que serão descritas à seguir.

### Camada de API

Nesta camada, utilizaremos controllers para:
* Fazer toda a interação com e abstração dos diferentes componentes do protocolo HTTP
* Tratar e validar o input do usuário antes de passar para os serviços
* Devolver a resposta no formato apropriado
* Responder com erros apropriados caso o servidor não lide bem com o input do usuário ou caso ele seja inválido.

Todas as requisições que fazem algum tipo de alteração no estado da aplicação, ou no banco de dados, utilizarão o método `POST`, enquanto todas as requisições de consulta utilizarão o método `GET`

### Camada de Serviços

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

Como toda requisição do tipo `POST` tem a opção de fazer uso de um DTO, que é uma classe do tipo "Data to Object", faremos junto com a conversão de dado para objeto uma validação, de forma que antes mesmo da informação ser passada para o controller, ela já será pré processada e pré validada.

Nossa convenção de nomeação para os DTOS será a seguinte:

`<NomeDoEndpoint>Dto`: Caso o DTO não possua validação de dados.
`<NomeDoEndpoint>Validator`: Caso o DTO possua validação de dados.

Um filtro de exceções será adicionado para retornar uma resposta apropriada ao usuário quando uma classe não for aceita pelo validador. 

Retornaremos um erro `400 Bad Request` na requisição quando um input não estiver no formato correto.

DTOs serão utilizados em requisições HTTP do tipo `POST`, e Pipes de validação serão utilizados para requisições do tipo `GET`


### Validação de dados nos Serviços

Por ser uma verificação de regra de negócio, a verificação será feita manualmente, e sempre que algum input for inválido, lançaremos uma Exceção que será captada pelo NestJs e uma resposta apropriada será enviada ao usuário.

Por via de regra usaremos a exceção associada ao código de status HTTP "BadRequest", que já possui um handler nativo do Nest, mas caso seja necessário abstrair totalmente algum serviço da camada de API então a classe do erro seria substituida por uma classe agnóstica e um handler para ela seria criada.


