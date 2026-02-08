const WIN_EPITAPHS = [
  'The Watch slept safely. The seal held.',
  'Justice found its mark. The covenant endures.',
  'One name, one truth. The Oathbreaker is named.',
  'The runes spoke. The Watch listened.',
  'By elder law, the liar stands condemned.',
  'The ledger is balanced. The Watch stands.',
  'No oath escapes the runes. None.',
  'The covenant holds. Another day earned.',
];

const LOSS_EPITAPHS = [
  'The covenant cracked. The Oathbreaker walked.',
  'The Watch faltered. The seal is broken.',
  'A false name sealed. The liar walks free.',
  'The runes wept. The Watch failed.',
  'An innocent condemned. The truth lies buried.',
  'The ledger bleeds. The wrong name was spoken.',
  'The Oathbreaker smiles. The Watch mourns.',
  'One chance, wasted. The covenant falls.',
];

export function getVerdictEpitaph(seed: number, won: boolean): string {
  const pool = won ? WIN_EPITAPHS : LOSS_EPITAPHS;
  return pool[seed % pool.length];
}
