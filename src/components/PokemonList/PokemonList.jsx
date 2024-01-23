import { useEffect, useState } from "react";
import axios from 'axios';
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";
function PokemonList() {
    
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    
    const [pokedexUrl,setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');

    const [nextUrl,setNextUrl] = useState('');
    const [prevUrl,setPrevUrl] = useState('');

    async function downloadPokemons() {
        setIsloading(true);
        const response = await axios.get(pokedexUrl); //THIS DOWNLOAD 20 LIST OF POKEMON//

       const pokemonResults = response.data.results; // WE GET THE ARRAY OF POKEMONS FROM RESULT //
        console.log( response.data);

        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);


        // ITERATING OVER THE ARRAY OF POKEMONS, AND USING THEIR URL, TO CREATE AN ARRAY OF PROMISES//
        // THAT WILL DOWNLOAD THOSE 20 POKEMONS//
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        //PASSING THAT PROMISES ARRAY TO AXIOS.ALL
        const pokemonData = await axios.all(pokemonResultPromise);//ARRAY OF 20 POKEMON DETAILED DATA//
        console.log(pokemonData);
        // NOW ITERATE ON THE DATA OF EACH POKEMON, AND EXTRACT ID,NAME,IMAGE,TYPES
        const res = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types
            }
        });
        console.log(res);
        setPokemonList(res)
        setIsloading(false);
    }

    useEffect(() => {
        downloadPokemons();
    }, [pokedexUrl]); //use for fir fetching the data//



    return (
        <>
            <div className="pokemon-list-wrapper">
              
                <div className="pokemon-wrapper">
                {(isLoading) ? 'Loading....' :
                    pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
                }

                </div>
                <div className="controlls">
                    <button disabled={prevUrl == null} onClick={() => setPokedexUrl(prevUrl)} >Prev</button>
                    <button disabled={nextUrl == null} onClick={() => setPokedexUrl(nextUrl)} >Next</button>
                </div>
            </div>
        </>
    )
}
export default PokemonList;