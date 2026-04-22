import { render, screen } from '@testing-library/react';
import Login from '../pages/login';

const signInMock = jest.fn((props: { routing?: string }) => (
	<div data-testid="clerk-signin">Mock Clerk SignIn ({props.routing})</div>
));

jest.mock('@clerk/clerk-react', () => ({
	SignIn: (props: { routing?: string }) => signInMock(props),
}));

describe('Login page with Clerk', () => {
	beforeEach(() => {
		signInMock.mockClear();
	});
	//Test 1: check landing heading message is rendered 
	it('renders login heading and subtitle', () => {
		render(<Login />);

		expect(screen.getByRole('heading', { name: /WELCOME TO ASSESSLY/i })).toBeTruthy();
		expect(screen.getByText(/Generate practice quizzes from course content/i)).toBeTruthy();
	});
	//Test 2: Clerk signin module is rendered with virtual routing mode 
	it('renders Clerk SignIn in virtual routing mode', () => {
		render(<Login />);

		expect(screen.getByTestId('clerk-signin')).toBeTruthy();
		expect(signInMock).toHaveBeenCalledWith(
			expect.objectContaining({ routing: 'virtual' })
		);
	});
	//Test 3: login (man) image rendered 
	it('renders the login illustration', () => {
		render(<Login />);

		expect(screen.getByAltText(/Login Image/i)).toBeTruthy();
	});
});
