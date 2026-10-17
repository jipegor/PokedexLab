async function buscarPokemon(nombre) {
  let url = "https://pokeapi.co/api/v2/pokemon/" + nombre.toLowerCase();
  let respuesta = await fetch(url);

  if (!respuesta.ok) {
    console.log("Error: no se encontró el pokémon (status " + respuesta.status + ")");
    return null;
  }

  return await respuesta.json();
}

function mostrarFicha(datos) {
  if (datos === null) {
    console.log("No hay nada que mostrar");
    return;
  }

  console.log("#" + datos.id + " " + datos.name.toUpperCase());

  let nombresTipos = [];
  for (let t of datos.types) {
    nombresTipos.push(t.type.name);
  }
  console.log("Tipos: " + nombresTipos.join(" / "));

  console.log("Altura: " + datos.height * 10 + " cm");
  console.log("Peso: " + datos.weight / 10 + " kg");

  console.log("Stats:");
  for (let s of datos.stats) {
    console.log("  " + s.stat.name + ": " + s.base_stat);
  }

  console.log("Habilidades:");
  for (let a of datos.abilities) {
    let oculta = a.is_hidden ? " (oculta)" : "";
    console.log("  " + a.ability.name + oculta);
  }
}

function obtenerStat(datos, nombreStat) {
  for (let s of datos.stats) {
    if (s.stat.name === nombreStat) {
      return s.base_stat;
    }
  }
  return null;
}

async function compararPokemon(nombre1, nombre2, stat) {
  let datos1 = await buscarPokemon(nombre1);
  let datos2 = await buscarPokemon(nombre2);

  if (datos1 === null || datos2 === null) {
    console.log("No se puede comparar: uno de los pokémon no existe");
    return;
  }

  let valor1 = obtenerStat(datos1, stat);
  let valor2 = obtenerStat(datos2, stat);

  if (valor1 === null || valor2 === null) {
    console.log("Stat no válida. Usa: hp, attack, defense, special-attack, special-defense, speed");
    return;
  }

  console.log(nombre1 + " (" + valor1 + ") vs " + nombre2 + " (" + valor2 + ") en " + stat);

  if (valor1 > valor2) {
    console.log("Gana " + nombre1);
  } else if (valor2 > valor1) {
    console.log("Gana " + nombre2);
  } else {
    console.log("Empate");
  }
}

async function probar() {
  let pikachu = await buscarPokemon("pikachu");
  console.log(pikachu.name, pikachu.id);

  let charizard = await buscarPokemon("charizard");
  console.log(charizard.name, charizard.id);

  let bulbasaur = await buscarPokemon("bulbasaur");
  console.log(bulbasaur.name, bulbasaur.id);

  let noExiste = await buscarPokemon("nopokemon");
  console.log(noExiste);

  let ficha = await buscarPokemon("pikachu");
  mostrarFicha(ficha);

  await compararPokemon("snorlax", "machamp", "attack");
  await compararPokemon("pikachu", "charizard", "defense");
  await compararPokemon("pikachu", "charizard", "fuerza");
}

async function pokemonMasFuerte(listaNombres, stat) {
  let mejorNombre = null;
  let mejorValor = -1;

  for (let nombre of listaNombres) {
    let datos = await buscarPokemon(nombre);
    if (datos === null) {
      continue;
    }

    let valor = obtenerStat(datos, stat);
    if (valor === null) {
      continue;
    }

    if (valor > mejorValor) {
      mejorValor = valor;
      mejorNombre = nombre;
    }
  }

  if (mejorNombre === null) {
    console.log("Ningún pokémon válido para la stat " + stat);
    return null;
  }

  console.log("El más fuerte en " + stat + " es " + mejorNombre + " (" + mejorValor + ")");
  return mejorNombre;
}

probar();

  let ganador = await pokemonMasFuerte(["pikachu", "snorlax", "machamp", "charizard"], "attack");
  console.log("Ganador:", ganador);

    let miEquipo = ["pikachu", "charizard", "bulbasaur", "snorlax", "machamp", "gengar"];

  let masAtaque = await pokemonMasFuerte(miEquipo, "attack");
  let masDefensa = await pokemonMasFuerte(miEquipo, "defense");

  let fichaGanador = await buscarPokemon(masAtaque);
  mostrarFicha(fichaGanador);
  console.log("Más defensa:", masDefensa);