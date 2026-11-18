# ⚜ Magicdle

Jogo de adivinhação de cartas de **Magic: The Gathering**. Uma carta aparece muito borrada, e a cada palpite errado a imagem fica mais nítida. Você tem **5 tentativas** para descobrir qual é.

🎮 **Jogar:** https://joaovbatista.github.io/magicdle/

> Projeto de fãs, sem fins lucrativos. Magic: The Gathering é © Wizards of the Coast. Dados e imagens das cartas por [Scryfall](https://scryfall.com). Não é aprovado nem apoiado pela Wizards of the Coast ou pelo Scryfall.

## Recursos

- **Desafio Diário:** uma carta por dia, igual para todos (virada às 00:00 UTC), com pontuação, sequência de vitórias e botão de compartilhar com grade de emojis.
- **Modo Treino:** cartas aleatórias ilimitadas, com filtro opcional por formato (Standard, Pioneer, Modern, Legacy, Vintage, Commander, Pauper, Premodern e Duel Commander). Não afeta suas estatísticas.
- **Ranking global:** login com Google, ranking do dia (pontos e, no empate, quem terminou primeiro) e ranking geral.
- **Estatísticas locais:** partidas, vitórias, sequência, média de tentativas, pontos e distribuição de acertos.
- **Três idiomas de interface:** Português, English e Español. Os nomes e as imagens das cartas são sempre em inglês.
- **Busca com autocomplete** pela API do Scryfall, com teclado e mouse.
- **Layout de uma página, sem scroll**, responsivo para desktop e celular.

## Pontuação

| Acertou na tentativa | Pontos |
|---|---:|
| 1 | 1000 |
| 2 | 800 |
| 3 | 600 |
| 4 | 400 |
| 5 | 200 |
| Não acertou | 0 |

## Estrutura do repositório

```
.
├── magicdle/
│   └── index.html                  # o jogo inteiro (HTML + CSS + JS)
├── scripts/
│   └── pick-daily-card.mjs         # sorteia a carta do dia e grava no Firestore
├── .github/workflows/
│   └── daily-card.yml              # executa o sorteio todos os dias
├── firestore.rules                 # regras de segurança do Firestore
└── README.md
```

## Rodar localmente

Não precisa de build nem de dependências. Abra `magicdle/index.html` no navegador (com internet) ou sirva a pasta:

```bash
cd magicdle
python -m http.server 8000   # abra http://localhost:8000
```

Sem Firebase configurado (`FIREBASE_CONFIG = null`), o jogo funciona offline do ranking: a carta do dia é escolhida no navegador a partir da data, e as estatísticas ficam no `localStorage`.

## Publicar no GitHub Pages

1. Em **Settings → Pages**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
2. A URL será `https://SEU-USUARIO.github.io/magicdle/`. O arquivo precisa se chamar `index.html`, em minúsculas.

## Ativar login e ranking (Firebase, plano gratuito)

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com) (plano Spark).
2. **Authentication → Sign-in method → Google:** ative e, em *Settings → Authorized domains*, adicione `SEU-USUARIO.github.io`.
3. **Firestore Database:** crie em modo de produção e, na aba *Regras*, publique o conteúdo de `firestore.rules`.
4. **Configurações do projeto → Seus apps → Web:** registre o app e cole o objeto `firebaseConfig` em `FIREBASE_CONFIG` no `magicdle/index.html`. Essa chave é pública por desenho; a proteção vem das regras.
5. **Configurações do projeto → Contas de serviço → Gerar nova chave privada.** Salve o JSON como secret `FIREBASE_SERVICE_ACCOUNT` em *Settings → Secrets and variables → Actions*. **Nunca faça commit desse arquivo.**
6. Em **Actions → Pick daily card → Run workflow**, rode uma vez para criar a carta de hoje.
7. No primeiro acesso ao ranking do dia, o console do navegador mostra um link para criar o índice composto do Firestore. Clique nele e aguarde alguns minutos.

## Como funciona a segurança

Sem Cloud Functions (que exigem plano pago), a validação fica nas regras do Firestore:

- A carta do dia é sorteada por um workflow agendado do GitHub (23:30 e 00:10 UTC). A imagem fica num documento público e a resposta num documento que o jogador não consegue ler.
- Cada palpite é um documento criado em ordem, uma única vez, e nenhum palpite é aceito depois de um acerto.
- O resultado só é aceito se bater com os palpites gravados. Os pontos seguem a tabela, e os totais do jogador só crescem pelo resultado verificado, gravado no mesmo lote.
- A resposta só pode ser lida depois que o jogador termina a partida do dia.

## Limitações conhecidas

- O link da imagem da carta contém o código dela no Scryfall, então um jogador determinado pode descobrir a resposta por ali. Uma melhoria possível é gerar as imagens já borradas no workflow.
- Quem criar várias contas ganha mais tentativas, e não há filtro de palavrões nos apelidos.
- O plano gratuito do Firebase tem cotas diárias de leitura e escrita.
- Agendamentos do GitHub Actions podem atrasar e são desativados em repositórios sem atividade por cerca de 60 dias.
- As regras de segurança devem ser testadas no Rules Playground ou no emulador do Firebase antes de divulgar o jogo.

## Ideias futuras

- Imagens pré-borradas geradas no servidor.
- Desafios por formato, cor ou set com ranking próprio.
- Desafio entre amigos por link.
- Sequência de vitórias no ranking.

## Créditos

- Dados e imagens: [Scryfall](https://scryfall.com) (API pública).
- Login e banco de dados: [Firebase](https://firebase.google.com).
- Inspirado nos jogos de adivinhação diária no estilo "-dle".