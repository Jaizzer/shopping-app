import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GamingPlatforms from './GamingPlatforms';

describe('Gaming Platforms component', () => {
	it('renders all icons if the platforms did not exceed 6', () => {
		render(<GamingPlatforms platforms={['Apple Macintosh', 'PC', 'Xbox']} />);
		const platformIcons = screen.queryAllByTestId('icon');
		expect(platformIcons.length).toEqual(3);
	});

	it('renders a remaining platforms indicator which shows the number of other platform icons that were not rendered', () => {
		render(
			<GamingPlatforms
				platforms={['Apple Macintosh', 'PlayStation', 'Linux', 'PC', 'iOS', 'Nintendo', 'Xbox', 'Android', 'Web']}
				maximumNumberOfIconsToRender={6}
			/>
		);
		const remainingItemsIndicator = screen.queryByText('+3');
		expect(remainingItemsIndicator).not.toBeNull();
	});
});
