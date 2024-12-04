import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet } from 'react-native';

const apiKey = '9362fcc2459e47b5948234fb532f9f2a';
const baseUrl = `https://api.rawg.io/api/games?key=${apiKey}`;

export default function GameSearch() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Carregar jogos na tela de inicial
  useEffect(() => {
    fetchRandomGames();
  }, []);

  const fetchRandomGames = async () => {
    try {
      const response = await fetch(`${baseUrl}&page_size=10`); // Exibe 10 jogos aleatórios
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setGames(data.results);
        setErrorMessage('');
      } else {
        setGames([]);
        setErrorMessage('Não foi possível carregar jogos.');
      }
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      setErrorMessage('Erro ao carregar jogos. Tente novamente mais tarde.');
    }
  };

  const fetchGames = async (query) => {
    const url = `${baseUrl}&search=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setGames(data.results);
        setErrorMessage('');
      } else {
        setGames([]);
        setErrorMessage('Não foi encontrado nenhum jogo.');
      }
    } catch (error) {
      console.error('Erro ao buscar os jogos:', error);
      setErrorMessage('Erro ao buscar os jogos. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Busque um jogo..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          if (text) {
            fetchGames(text);
          } else {
            fetchRandomGames(); // Voltar para o inicio se a busca estiver vazia
          }
        }}
      />

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.gameItem}>
              <Image
                source={{ uri: item.background_image }}
                style={styles.image}
              />
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.info}>
                Plataformas:{' '}
                {item.platforms
                  ? item.platforms.map((platform) => platform.platform.name).join(', ')
                  : 'Informação não disponível'}
              </Text>
              <Text style={styles.info}>
                Publisher:{' '}
                {item.publishers && item.publishers.length > 0
                  ? item.publishers.map((pub) => pub.name).join(', ')
                  : 'Informação não disponível'}
              </Text>
              <Text style={styles.date}>Data de lançamento: {item.released || 'Não disponível'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  gameItem: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
});
