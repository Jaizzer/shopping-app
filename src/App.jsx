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
import ProductDetails from './ProductDetails';

export default function App() {
	const { content } = useParams();
	const [products, setProducts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const { id } = useParams();
	const [clickedProduct, setClickedProduct] = useState(null);
	const [isClickedProductLoading, setIsClickedProductLoading] = useState(true);
	const [clickedProductError, setClickedProductError] = useState(false);
	const [pageToRequestFromAPI, setPageToRequestFromAPI] = useState(1);

	// Cart is composed of products that have product cart quantity greater than zero
	const cart = products.filter((product) => product.productCartQuantity > 0);

	function getNewProducts() {
		setPageToRequestFromAPI((prev) => prev + 1);
	}

	// Fetch the products using the RAWG GAMES API
	useEffect(() => {
		(async function () {
			try {
				const response = await fetch(
					`https://api.rawg.io/api/games?key=99ef179fc1ee4d77a91ccee7e1bb59e6&page=${pageToRequestFromAPI}&page_size=100`
				);
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

				setProducts(products.concat(modifiedProducts));
			} catch (error) {
				setError(error ? true : false);
			} finally {
				setLoading(false);
			}
		})();
	}, [pageToRequestFromAPI]);

	// Clear the previously loaded products details when moving to a different page that is not 'gameDetails'
	if (content != 'gameDetails' && clickedProduct !== null) {
		setClickedProduct(null);
		setIsClickedProductLoading(true);
	}

	// Clear the previously loaded product details when new product was clicked in the search dropdown while in '/gameDetails' route
	if (content === 'gameDetails' && id && clickedProduct && parseInt(id) !== clickedProduct.id) {
		setClickedProduct(null);
		setIsClickedProductLoading(true);
	}

	// Get the necessary details about the clicked product
	useEffect(() => {
		if (id !== undefined) {
			(async function () {
				try {
					const detailsResponse = await fetch(`https://api.rawg.io/api/games/${id}?key=99ef179fc1ee4d77a91ccee7e1bb59e6`);
					const jsonDataDetails = await detailsResponse.json();
					const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=99ef179fc1ee4d77a91ccee7e1bb59e6`);
					const jsonDataImages = await screenshotsResponse.json();
					const modifiedProduct = {
						id: jsonDataDetails.id,
						title: jsonDataDetails.name,
						description: jsonDataDetails.description_raw,
						rating: jsonDataDetails.rating,
						price: 45,
						developers: jsonDataDetails.developers.map((developer) => developer.name),
						genres: jsonDataDetails.genres.map((genre) => genre.name),
						releaseDate: jsonDataDetails.released,
						platforms: jsonDataDetails.platforms.map((platform) => platform.platform.name),
						screenshots: [jsonDataDetails.background_image, ...jsonDataImages.results.map((result) => result.image)],
					};
					setClickedProduct(modifiedProduct);
				} catch (error) {
					setClickedProductError(error ? true : false);
				} finally {
					setIsClickedProductLoading(false);
				}
			})();
		}
	}, [id]);

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
					<Shop onAddItemToCart={onAddItemToCart} products={products} error={error} loading={loading} getNewProducts={getNewProducts} />
				) : content === 'about' ? (
					<About />
				) : content === 'cart' ? (
					<Cart onAddItemToCart={onAddItemToCart} products={cart} />
				) : content === 'gameDetails' && id !== undefined ? (
					<ProductDetails key={id} product={clickedProduct} loading={isClickedProductLoading} error={clickedProductError} />
				) : (
					<Error />
				)}
			</main>
		</>
	);
}
