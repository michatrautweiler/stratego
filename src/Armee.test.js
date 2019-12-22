import { Armee }  from './Armee';

it('should return all AdA', () => {
  // original state.
  var armee = new Armee("blau", "test", 3);
  armee.flagge = new Armee("grün", "flagge", 4);
  armee.soldaten[0] = new Armee("weiss", "soldat", 5);
  armee.soldaten[1] = new Armee("weiss", "soldat", 6);
  armee.bomben = [];
  armee.mineure[0] = new Armee("schwarz", "mineur", 7);

  // make move.
  var adas = armee.ada();
  
  // verify new state.
  expect(adas).toEqual([armee.flagge, armee.soldaten[0], armee.soldaten[1], armee.mineure[0]]);
});