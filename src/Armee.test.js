import { Armee }  from './Armee';

it('should return all AdA', () => {
  // original state.
  var armee = new Armee("blau", "test", 3);
  armee.flagge = new Armee("grün", "flagge", 4);
  armee.soldaten[0] = new Armee("weiss", "soldat", 5);
  armee.soldaten[1] = new Armee("weiss", "soldat", 6);
  armee.bomben = [];
  armee.mineure[0] = new Armee("schwarz", "mineur", 7);

  // right size
  while (armee.soldaten.length < 2) armee.soldaten.push({gattung: "soldat", num:armee.soldaten.length});
  while (armee.soldaten.length > 2) armee.soldaten.pop();
  while (armee.bomben.length < 3) armee.bomben.push({gattung: "bombe", num:armee.bomben.length});
  while (armee.bomben.length > 3) armee.bomben.pop();
  while (armee.mineure.length < 1) armee.mineure.push({gattung: "mineur", num:armee.mineure.length});
  while (armee.mineure.length > 1) armee.mineure.pop();

  // make move.
  var adas = armee.ada();
  
  // verify new state.
  expect(adas.length).toEqual(7);
  expect(adas).toEqual([armee.flagge, armee.soldaten[0], armee.soldaten[1], armee.bomben[0], armee.bomben[1], armee.bomben[2], armee.mineure[0]]);
});