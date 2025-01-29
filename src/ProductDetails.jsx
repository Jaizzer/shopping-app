import PropTypes from 'prop-types';
import ImageSlider from './ImageSlider';
import StarRating from './StarRating';

function ProductDetails({ product, loading, error }) {
	return (
		<>
			{loading ? (
				<div title="loading-indicator" className="loadingIndicator">
					Loading...
				</div>
			) : error ? (
				<div className="errorMessage" title="error-message">
					Error
				</div>
			) : (
				<div className="productDetails">
					<h1 className="productTitle">{product.title}</h1>
					<div className="productRating">
						<div className="productRatingHeading">Rating</div>
						<div className="productRatingContent">
							{product.rating ? (
								<>
									<StarRating rating={product.rating} />({product.rating})
								</>
							) : (
								'No Rating'
							)}
						</div>
					</div>
					{product.screenshots.length > 1 && <ImageSlider imageLinks={product.screenshots}></ImageSlider>}
					<div className="productDescriptionContainer">
						<h2 className="productDescriptionHeading">Description</h2>
						<div className="productDescriptionContent">{product.description ? product.description : 'No available description.'}</div>
					</div>
					<div className="productPrice">{product.price ? `$${product.price}` : 'Price Unavailable'}</div>
					<div className="otherDetails">
						<div className="productGenre">
							<h2 className="productGenreHeading">Genre</h2>
							<div className="productGenreContent">{product.genres ? product.genres.join(', ') : 'Unknown'}</div>
						</div>
						<div className="productDeveloper">
							<h2 className="productDeveloperHeading">Developer</h2>
							<div className="productDeveloperContent">{product.developers ? product.developers.join(', ') : 'Unknown'}</div>
						</div>
						<div className="productReleaseDate">
							<h2 className="productReleaseDateHeading">Release Date</h2>
							<div className="productReleaseDateContent">
								{product.releaseDate
									? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(
											new Date(product.releaseDate)
									  )
									: 'Unknown'}
							</div>
						</div>
						<div className="productPlatforms">
							<h2 className="productPlatformsHeading">Platforms</h2>
							<div className="productPlatformsContent">{product.platforms ? product.platforms.join(', ') : 'Unknown'}</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

ProductDetails.propTypes = {
	product: PropTypes.object,
	loading: PropTypes.bool,
	error: PropTypes.bool,
};

export default ProductDetails;
