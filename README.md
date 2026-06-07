#  Agenda App – Projeto AV2 Front-End

##  Sobre o Projeto

O **Agenda** é uma aplicação web desenvolvida em **React JS** com o objetivo de auxiliar usuários no gerenciamento de compromissos, tarefas e eventos do dia a dia.

O sistema foi criado como parte do **Projeto Integrado**, aplicando conceitos estudados nas disciplinas relacionadas ao desenvolvimento web, arquitetura de software e engenharia de software.

A aplicação permite organizar atividades pessoais e profissionais através de uma interface moderna, intuitiva e responsiva.

---

#  Objetivos

* Facilitar o gerenciamento de eventos e compromissos.
* Permitir o controle de tarefas pendentes e concluídas.
* Organizar atividades através de categorias personalizadas.
* Disponibilizar notificações e lembretes para eventos importantes.
* Oferecer uma experiência visual agradável através de temas e personalização.

---

#  Tecnologias Utilizadas

* React JS
* React Router DOM
* Context API
* JavaScript (ES6+)
* HTML5
* CSS3
* Lucide React (ícones)
* LocalStorage (persistência de dados)
* Vite

---

#  Funcionalidades

## Dashboard

* Visualização geral das atividades.
* Resumo de eventos e tarefas.
* Indicadores de produtividade.

## Calendário

* Exibição mensal dos eventos.
* Destaque para o dia atual.
* Visualização rápida dos compromissos cadastrados.

## Visão do Dia

* Exibição detalhada dos eventos de uma data específica.
* Organização por horário.

## Gerenciamento de Tarefas

* Cadastro de tarefas.
* Marcação de tarefas concluídas.
* Controle de prioridade.
* Associação com categorias.

## Notificações

* Alertas sobre eventos e tarefas.
* Controle de notificações lidas e não lidas.
* Limpeza de notificações.

## Categorias

* Criação de categorias personalizadas.
* Definição de cores para organização visual.

## Configurações

* Alteração de temas da interface.
* Personalização da cor de destaque.
* Configuração de notificações.
* Reinicialização dos dados da aplicação.

---

#  Arquitetura do Sistema

O sistema foi desenvolvido utilizando uma arquitetura baseada em componentes React.

### Componentes Principais

* Sidebar
* Dashboard
* Calendário
* Visão do Dia
* Tarefas
* Notificações
* Categorias
* Configurações

### Gerenciamento de Estado

A aplicação utiliza a **Context API** para compartilhamento global dos dados entre os componentes.

O contexto centraliza:

* Eventos
* Tarefas
* Categorias
* Notificações
* Configurações do usuário

---

#  Persistência de Dados

Os dados são armazenados localmente utilizando o **LocalStorage**, permitindo que as informações permaneçam disponíveis mesmo após o fechamento do navegador.

Dados persistidos:

* Eventos
* Tarefas
* Categorias
* Notificações
* Configurações

---

#  Interface

A interface foi desenvolvida com foco em:

* Usabilidade
* Responsividade
* Organização visual
* Personalização

O sistema oferece múltiplos temas:

* Dark
* Light
* Midnight
* Forest
* Rose

Além disso, o usuário pode personalizar a cor principal da aplicação.

---

#  Como Executar o Projeto

## Instalação

```bash
npm install
```

## Executar em modo de desenvolvimento

```bash
npm run dev
```

## Gerar versão de produção

```bash
npm run build
```

## Visualizar versão de produção

```bash
npm run preview
```

---

# 🌐 Deploy

O projeto foi hospedado utilizando:

* Vercel


Deploy oficial:

trabalho-front-end-agenda.vercel.app

---

#  Conceitos Aplicados

Durante o desenvolvimento foram aplicados os seguintes conceitos:

* Componentização
* Props
* Hooks
* Context API
* React Router
* Gerenciamento de Estado
* Persistência de Dados
* Arquitetura Front-End
* Design Responsivo

---

#  Equipe

Projeto desenvolvido para a disciplina de Front-End.

Instituição: Uninassau

Professor(a): Victor Brunno

Integrantes:

* Alexandre Henrique Aciole Tavares Vital
* Arthur Nobre Lins Nascimento
* Daniel Silva Borges
* Walter Jatobá Santos

---

#  Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos.
