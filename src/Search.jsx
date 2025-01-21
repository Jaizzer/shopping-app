import { useState, useEffect } from 'react';
import SearchDropdown from './SearchDropDown';

function Search() {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	// Wait for the user to stop typing before fetching the search result
	useEffect(() => {
		const delaySearch = setTimeout(() => {
			getSearchResults(inputValue);
		}, 400);

		return () => {
			// Cancel previous timers
			clearTimeout(delaySearch);

			// Display loading indicator whenever the user types again
			setIsLoading(true);
		};
	}, [inputValue]);

	async function getSearchResults(searchQuery) {
		try {
			// Get the search results
			const response = await fetch(`https://api.rawg.io/api/games?key=99ef179fc1ee4d77a91ccee7e1bb59e6&search=${searchQuery}`);
			const jsonData = await response.json();
			const searchResults = jsonData.results.map((product) => ({
				name: product.name,
				id: product.id,
				price: 89,
				image: product.background_image,
			}));
			setData(searchResults);
		} catch {
			setError(true);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="search">
			<div className="searchBar">
				<div className="searchLogoContainer"></div>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						if (e.target.value === '') {
							setIsDropdownVisible(false);
						} else {
							setIsDropdownVisible(true);
						}
					}}
					onBlur={() => setIsDropdownVisible(false)}
				/>
			</div>
			{isDropdownVisible ? <SearchDropdown data={data} error={error} loading={isLoading} /> : null}
		</div>
	);
}

export default Search;
