import Sidebar from './Sidebar';
import Home from './Home';
import Account from './Account';
import About from './About';
import Shop from './Shop';
import Error from './Error';
import Cart from './Cart';
import TopBar from './TopBar';
import { useParams } from 'react-router-dom';
import GameDetails from './GameDetails';
import useFetchGame from './useFetchGame';
import useFetchGames from './useFetchGames';
import { useState } from 'react';

export default function App() {
	const { pageToDisplay } = useParams();
	const { id } = useParams();
	const [game, isGameHaveError, isGameLoading] = useFetchGame(id);
	const [games, gamesError, isGamesLoading, getNewGames] = useFetchGames();

	const [cart, setCart] = useState([]);

	function addToCart(gameToAdd) {
		// Add the game to the cart
		setCart(cart.concat({ ...gameToAdd }));
	}

	function removeItem(gameID) {
		// Remove an item from the cart
		setCart(cart.filter((item) => item.id !== gameID));
	}

	function clearCart() {
		// Clear all the contents of the cart
		setCart([]);
	}

	return (
		<>
			<Sidebar></Sidebar>
			<TopBar cartContentCount={cart.length}></TopBar>
			<main>
				{!pageToDisplay ? (
					<Home />
				) : pageToDisplay === 'account' ? (
					<Account />
				) : pageToDisplay === 'shop' ? (
					<Shop games={games} error={gamesError} loading={isGamesLoading} getNewGames={getNewGames} />
				) : pageToDisplay === 'about' ? (
					<About />
				) : pageToDisplay === 'cart' ? (
					<Cart content={cart} removeItem={removeItem} clearCart={clearCart} />
				) : pageToDisplay === 'gameDetails' && id !== undefined ? (
					<GameDetails
						key={id}
						game={game}
						loading={isGameLoading}
						error={isGameHaveError}
						onAddItemToCart={addToCart}
						isGameInCart={cart.filter((item) => item.id === game.id).length === 1}
					/>
				) : (
					<Error />
				)}
			</main>
		</>
	);
}
