import { Armee }  from './Armee';

it('should return all AdA', () => {
  // original state.
  var armee = new Armee("blau", "test", 3);
  armee.flagge = [{gattung: "flagge"}];

  // right size
  while (armee.soldaten.length < 2) armee.soldaten.push({gattung: "soldaten", num:armee.soldaten.length});
  while (armee.soldaten.length > 2) armee.soldaten.pop();
  while (armee.bomben.length < 3) armee.bomben.push({gattung: "bomben", num:armee.bomben.length});
  while (armee.bomben.length > 3) armee.bomben.pop();
  while (armee.mineure.length < 1) armee.mineure.push({gattung: "mineure", num:armee.mineure.length});
  while (armee.mineure.length > 1) armee.mineure.pop();

  // make move.
  var adas = armee.ada();
  
  // verify new state.
  expect(adas.length).toEqual(7);
  expect(adas).toEqual([armee.flagge[0], armee.soldaten[0], armee.soldaten[1], armee.bomben[0], armee.bomben[1], armee.bomben[2], armee.mineure[0]]);
});

it('should be istAufgestellt if no figures are left', () => {
  // original state.
  var armee = new Armee("blau", "reserve", 3);
  armee.flagge = [];
  armee.soldaten = null;
  armee.mineure = [];
  armee.bomben = [];

  // make move.
  let isDone = armee.istAufgestellt();
  let figuren = armee.ada();
  
  // verify new state.
  expect(isDone).toEqual(true);
  expect(figuren.length).toEqual(0);
});