async function explorar() {
  let respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
  let datos = await respuesta.json();

  console.log("--- Tipos ---");
  for (let t of datos.types) {
    console.log(t.type.name);
  }

  console.log("--- Stats ---");
  for (let s of datos.stats) {
    console.log(s.stat.name + ": " + s.base_stat);
  }

  console.log("--- Habilidades ---");
  for (let a of datos.abilities) {
    console.log(a.ability.name);
  }
}

explorar();