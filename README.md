FGis
======

Esse projeto tem como objetivo explorar a API do projeto OpenLayers, relacionada a criação e visualização de 
dados geográficos.

Compilação
==========

0. Clonar este repositório

        git clone <link para este repositório>

1. Instalar as depêndencias 

        npm install

2. Executar a aplicação no MacOS ou Linux

        DEBUG=FGis:* npm start

3. Executar a aplicação no Windows (cmd)

        set DEBUG=FGis:* & npm start
        
Acesse  http://localhost:3000/ para visualizar a aplicação.

Lista de Tarefas
===========================================
- [ ] Refatorar prototipo
- [x] Iniciar o projeto
- [x] Adicionar o formulário de criação de features
- [x] Adicionar o desfazer, refazer e limpar as opções de desenho de features
- [x] Criação do banco de dados para features
- [x] Listagem das features
- [ ] Salvar as features em GeoJSON
- [x] Plotar feature completa no mapa
- [ ] Excluir feature listada
- [ ] Editar feature listada
- [ ] Cadastrar wkt diretamente 

