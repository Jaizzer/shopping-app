import Sidebar from './Sidebar';
import Home from './Home';
import Account from './Account';
import About from './About';
import Shop from './Shop';
import Error from './Error';
import Cart from './Cart';
import TopBar from './TopBar';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function App() {
	const { content } = useParams();
	const [products, setProducts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// Cart is composed of products that have product cart quantity greater than zero
	const cart = products.filter((product) => product.productCartQuantity > 0);

	// Fetch the products using the RAWG GAMES API
	useEffect(() => {
		(async function () {
			try {
				const response = await fetch('https://api.rawg.io/api/games?key=99ef179fc1ee4d77a91ccee7e1bb59e6&page=3&page_size=100');
				const jsonData = await response.json();
				const modifiedProducts = jsonData.results.map((product) => {
					return {
						imageLink: product.background_image,
						productName: product.name,
						productPrice: Math.floor(Math.random() * (100 - 50) + 50),
						productId: `${product.id}`,
						productCartQuantity: 0,
						genre: product.genres.map((genre) => genre.name),
						platforms: product.platforms.map((platform) => platform.name),
						unitsSold: Math.floor(Math.random() * 1000000),
						releaseDate: product.released,
						esrbRating: product.esrb_rating ? product.esrb_rating.name : 'Unrated',
					};
				});
				setProducts(modifiedProducts);
			} catch (error) {
				setError(error ? true : false);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	function onAddItemToCart(productId, productCartQuantity) {
		// Update the products
		const updatedProducts = products.map((existingCartItem) =>
			existingCartItem.productId === productId ? { ...existingCartItem, productCartQuantity: productCartQuantity } : existingCartItem
		);
		setProducts(updatedProducts);
	}

	function getCartLength() {
		const cartItemsQuantity = cart.map((item) => item.productCartQuantity).reduce((acc, curr) => acc + curr, 0);
		return cartItemsQuantity;
	}

	return (
		<>
			<Sidebar></Sidebar>
			<TopBar cartContentCount={getCartLength()}></TopBar>
			<main>
				{!content ? (
					<Home />
				) : content === 'account' ? (
					<Account />
				) : content === 'shop' ? (
					<Shop onAddItemToCart={onAddItemToCart} products={products} error={error} loading={loading} />
				) : content === 'about' ? (
					<About />
				) : content === 'cart' ? (
					<Cart onAddItemToCart={onAddItemToCart} products={cart} />
				) : (
					<Error />
				)}
			</main>
		</>
	);
}
