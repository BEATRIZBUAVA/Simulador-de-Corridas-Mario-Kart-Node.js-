// Mario Kart Terminal Simulator
// Developed in Node.js

const readline = require('readline');

const CHARACTERS = [
  {
    name: 'Mario',
    velocidade: 4,
    manobrabilidade: 3,
    poder: 3
  },
  {
    name: 'Peach',
    velocidade: 3,
    manobrabilidade: 4,
    poder: 2
  },
  {
    name: 'Yoshi',
    velocidade: 2,
    manobrabilidade: 4,
    poder: 3
  },
  {
    name: 'Bowser',
    velocidade: 5,
    manobrabilidade: 2,
    poder: 5
  },
  {
    name: 'Luigi',
    velocidade: 3,
    manobrabilidade: 4,
    poder: 4
  },
  {
    name: 'Donkey Kong',
    velocidade: 2,
    manobrabilidade: 2,
    poder: 5
  }
];

const TRACK_BLOCKS = ['RETA', 'CURVA', 'CONFRONTO'];

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function getRandomBlock() {
  return TRACK_BLOCKS[Math.floor(Math.random() * TRACK_BLOCKS.length)];
}

function selectCharacter(name) {
  return CHARACTERS.find(c => c.name.toLowerCase() === name.toLowerCase());
}

function printCharacters() {
  console.log('Personagens disponíveis:');
  CHARACTERS.forEach(c => {
    console.log(`- ${c.name} (Velocidade: ${c.velocidade}, Manobrabilidade: ${c.manobrabilidade}, Poder: ${c.poder})`);
  });
}

function clampScore(score) {
  return Math.max(0, score);
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  printCharacters();

  function askCharacter(player) {
    return new Promise(resolve => {
      rl.question(`Escolha o personagem para o ${player}: `, answer => {
        const character = selectCharacter(answer);
        if (!character) {
          console.log('Personagem inválido. Tente novamente.');
          resolve(askCharacter(player));
        } else {
          resolve(character);
        }
      });
    });
  }

  const player1 = await askCharacter('Jogador 1');
  let player2;
  while (true) {
    player2 = await askCharacter('Jogador 2');
    if (player2.name !== player1.name) break;
    console.log('Jogador 2 deve ser diferente do Jogador 1.');
  }

  let score1 = 0;
  let score2 = 0;

  console.log('\nCorrida iniciada!\n');
  for (let round = 1; round <= 5; round++) {
    const block = getRandomBlock();
    console.log(`Rodada ${round}: Bloco da pista: ${block}`);
    const dice1 = rollDice();
    const dice2 = rollDice();
    let result1, result2;
    if (block === 'RETA') {
      result1 = dice1 + player1.velocidade;
      result2 = dice2 + player2.velocidade;
      console.log(`${player1.name} tirou ${dice1} + Velocidade (${player1.velocidade}) = ${result1}`);
      console.log(`${player2.name} tirou ${dice2} + Velocidade (${player2.velocidade}) = ${result2}`);
      if (result1 > result2) {
        score1++;
        console.log(`${player1.name} ganhou a rodada!`);
      } else if (result2 > result1) {
        score2++;
        console.log(`${player2.name} ganhou a rodada!`);
      } else {
        console.log('Empate! Ninguém pontua.');
      }
    } else if (block === 'CURVA') {
      result1 = dice1 + player1.manobrabilidade;
      result2 = dice2 + player2.manobrabilidade;
      console.log(`${player1.name} tirou ${dice1} + Manobrabilidade (${player1.manobrabilidade}) = ${result1}`);
      console.log(`${player2.name} tirou ${dice2} + Manobrabilidade (${player2.manobrabilidade}) = ${result2}`);
      if (result1 > result2) {
        score1++;
        console.log(`${player1.name} ganhou a rodada!`);
      } else if (result2 > result1) {
        score2++;
        console.log(`${player2.name} ganhou a rodada!`);
      } else {
        console.log('Empate! Ninguém pontua.');
      }
    } else if (block === 'CONFRONTO') {
      result1 = dice1 + player1.poder;
      result2 = dice2 + player2.poder;
      console.log(`${player1.name} tirou ${dice1} + Poder (${player1.poder}) = ${result1}`);
      console.log(`${player2.name} tirou ${dice2} + Poder (${player2.poder}) = ${result2}`);
      if (result1 > result2) {
        score2 = clampScore(score2 - 1);
        console.log(`${player1.name} venceu o confronto! ${player2.name} perde 1 ponto.`);
      } else if (result2 > result1) {
        score1 = clampScore(score1 - 1);
        console.log(`${player2.name} venceu o confronto! ${player1.name} perde 1 ponto.`);
      } else {
        console.log('Empate! Ninguém perde ponto.');
      }
    }
    console.log(`Pontuação: ${player1.name}: ${score1} | ${player2.name}: ${score2}\n`);
  }

  console.log('Corrida finalizada!');
  if (score1 > score2) {
    console.log(`\n${player1.name} venceu a corrida!`);
  } else if (score2 > score1) {
    console.log(`\n${player2.name} venceu a corrida!`);
  } else {
    console.log('\nEmpate!');
  }
  rl.close();
}

main();
