'use strict';

const getRandomInt = (max) => Math.floor(Math.random() * max);

const getStartPopulation = (pSize, gSize, maxGene) =>
  new Array(pSize).fill(0).map((_) => new Array(gSize).fill(0).map((_) => getRandomInt(maxGene)));

const fitnes = (genes, d, y) => Math.abs(y - genes.reduce((acc, v, i) => acc + v * d[i], 0));

const calculateProbability = (
  deltas,
  invSumDeltas = deltas.reduce((acc, delta) => acc + 1 / delta, 0),
) => deltas.map((delta) => 1 / delta / invSumDeltas);

const weightedRandom = (participants, random = Math.random()) =>
  participants
    .map(({gene, probability}) => ((random -= probability) < 0 ? gene : undefined))
    .filter((e) => !!e)[0];

const roulette = (participants, numWins) =>
  new Array(numWins).fill(null).map((_) => weightedRandom(participants));

const mixGene = ([parentA, parentB], mid = Math.floor(parentA.length / 2)) => [
  [...parentA.slice(0, mid), ...parentB.slice(mid)],
  [...parentB.slice(0, mid), ...parentA.slice(mid)],
];

const mutation = (gene, value, probability, r = Math.random(), index = getRandomInt(gene.length)) =>
  probability >= r ? gene.map((e, i) => (i === index ? value : e)) : gene;

const DiophantineEquation = (equation, populationSize, maxIterations = Infinity) => {
  const y = equation.pop();
  const maxGene = Math.ceil(y / 2);
  let population = getStartPopulation(populationSize, equation.length, maxGene);
  while (maxIterations--) {
    const deltas = population.map((gene) => fitnes(gene, equation, y));
    const result = deltas.indexOf(0);
    if (!!~result) return population[result];
    const propabilities = calculateProbability(deltas);
    const rouletteParticipants = population.map((e, i) => ({
      gene: e,
      probability: propabilities[i],
    }));
    population = [];
    for (let i = 0; i < populationSize / 2; i++) {
      const bestGenes = roulette(rouletteParticipants, 2);
      const mixedGenes = mixGene(bestGenes);
      const mutatedGenes = mixedGenes.map((gene) => mutation(gene, getRandomInt(maxGene), 0.1));
      population.push(...mutatedGenes);
    }
  }
  return population;
};

const research = (testData, min, max) => {
  const note = {};
  for (let i = min; i <= max; i++) {
    const startTime = new Date().getTime();
    const result = DiophantineEquation(Array.from(testData), i);
    const endTime = new Date().getTime();
    const time = endTime - startTime;
    console.dir({result})
    console.log(`population: ${i}, time: ${time} ms`);
    note[i] = time;
  }
  return note;
};

research([2, 4, 3, 12, 121], 4, 8);
