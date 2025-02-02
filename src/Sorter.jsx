import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DropdownIcon from './DropDownIcon';

const SorterContainer = styled.div`
	box-sizing: border-box;
	margin: 0px;

	width: clamp(200px, 80%, 320px);
	padding: 10px 18px;
	border-radius: 10px;
	background-color: #1b1e22;
`;

const PopOver = styled.div`
	box-sizing: border-box;
	margin: 0px;

	display: grid;
	gap: 10px;
	align-content: space-around;
	padding: 15px;
	background-color: transparent;
	font-family: 'Poppins';
`;

const SortButton = styled.button`
	box-sizing: border-box;
	margin: 0px;

	width: 100%;
	padding: 5px 15px;
	border-radius: 10px;
	border: 0px;

	display: flex;
	justify-content: space-between;
	align-items: center;

	background-color: transparent;
	font-size: 16px;
	font-weight: 600;
	text-align: justify;
	color: white;
`;

const SortOption = styled.div`
	box-sizing: border-box;
	margin: 0px;

	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	gap: 10px;
	font-size: 15px;
	color: ${(props) => (props.isClicked ? 'white' : '#858585')};
`;

const FilterActions = styled.div`
	box-sizing: border-box;
	margin: 0px;

	display: flex;
	justify-content: space-between;
	padding-top: 15px;
	font-size: 13px;
	color: white;
`;

function Sorter({ onSortItemClick }) {
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [selectedSortOption, setSelectedSortOption] = useState(null);
	const [isEverySortItemsVisible, setIsEverySortItemsVisible] = useState(false);

	// Create the sort option items to be put in DOM
	const sortOptions = [
		'Popularity: High to Low',
		'Release Date: Newest First',
		'Price: Low to High',
		'Price: High to Low',
		'Popularity: Low to High',
		'Release Date: Oldest First',
		'Name: A to Z',
		'Name: Z to A',
	];

	let sortOptionsDOM = [];
	if (isEverySortItemsVisible) {
		sortOptionsDOM = sortOptions.map((sortOption) => (
			<SortOption
				key={sortOption}
				title="sort-option"
				onClick={(e) => {
					// Set the clicked sort option else unset the clicked sort option if its the currently selected sort option
					let newlySelectedSortOption = e.target.textContent !== selectedSortOption ? e.target.textContent : null;
					onSortItemClick(newlySelectedSortOption);
					setSelectedSortOption(newlySelectedSortOption);
				}}
				isClicked={sortOption === selectedSortOption}
			>
				{sortOption}
			</SortOption>
		));
	} else {
		let numberOfShowLessItems = 3;
		// Limit the number of dropdown items to 'numberOfShowLessItems' if 'numberOfShowLessItems' was provided
		for (let index = 0; index < numberOfShowLessItems; index++) {
			let item = sortOptions[index];
			sortOptionsDOM.push(
				<SortOption
					key={item}
					title="sort-option"
					onClick={(e) => {
						// Set the clicked sort option else unset the clicked sort option if its the currently selected sort option
						let newlySelectedSortOption = e.target.textContent !== selectedSortOption ? e.target.textContent : null;
						onSortItemClick(newlySelectedSortOption);
						setSelectedSortOption(newlySelectedSortOption);
					}}
					isClicked={item === selectedSortOption}
				>
					{item}
				</SortOption>
			);
		}
	}

	return (
		<SorterContainer>
			<SortButton
				onClick={() => {
					setIsDropdownVisible(!isDropdownVisible);
				}}
			>
				Sort
				<DropdownIcon isDropdownCollapsed={!isDropdownVisible} />
			</SortButton>
			{isDropdownVisible && (
				<PopOver>
					{sortOptionsDOM}
					<FilterActions>
						<div
							onClick={() => {
								setIsEverySortItemsVisible(!isEverySortItemsVisible);
							}}
						>
							{isEverySortItemsVisible ? 'Show less' : 'Show more'}
						</div>
						<div
							className="clear"
							onClick={() => {
								// Unset the currently selected sort option
								onSortItemClick(null);
								setSelectedSortOption(null);
							}}
						>
							Clear
						</div>
					</FilterActions>
				</PopOver>
			)}
		</SorterContainer>
	);
}

Sorter.propTypes = {
	onSortItemClick: PropTypes.func,
};

export default Sorter;
