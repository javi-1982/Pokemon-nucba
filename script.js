async function fetchPokemon() {
    const pokemonId = document.getElementById('pokemonId').value;
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Limpiar cualquier resultado anterior

    if (!pokemonId) {
        resultContainer.innerHTML = '<p class="error">Por favor, ingresa un número válido.</p>';
        return;
    }

    try {
        // Datos del Pokémon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
          
        }
                
        const pokemon = await response.json();

        // Información del Pokémon
        const name = pokemon.name.toUpperCase();
        const type = pokemon.types[0].type.name;
        const height = pokemon.height / 10; // metros
        const weight = pokemon.weight / 10; // kilogramos
        const imageUrl = pokemon.sprites.front_default;
        const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');

        // Evolución
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();

        // Proxima evolutiva
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        const evolutionChain = getEvolutionChain(evolutionData.chain);

        // Mostrar tarjeta Pokémon
        resultContainer.innerHTML = `
            <div class="card">
                <img src="${imageUrl}" alt="${name}" class="big-image">
                <h2><u>${name}.</u></h2>
                <h3>Tipo: ${type}</h3>
                <h3>Altura: ${height} m</h3>
                <h3>Peso: ${weight} kg</h3>
                <h3>Habilidades: ${abilities}</h3>
                <h3>Evolución: ${evolutionChain}</h3>
            </div>
        `;

       
     } catch (error) {
        resultContainer.innerHTML = `<p class="error">${error.message}</p>`;

    }
}


// Función cadena de evolucion
function getEvolutionChain(chain) {
    let evolutionChain = chain.species.name;
    let currentEvolution = chain.evolves_to;

    while (currentEvolution.length > 0) {
        evolutionChain += ' → ' + currentEvolution[0].species.name;
        currentEvolution = currentEvolution[0].evolves_to;
    }

    return evolutionChain;
}