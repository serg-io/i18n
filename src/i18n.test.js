import i18n, { dictionary, load } from './i18n.js';

const DEFINITIONS = {
	submit: 'Submit',
	total: (total, defaultTotal = '') => `Total: $${ total || defaultTotal }`,
};

describe('dictionary', () => {
	it('should be an empty object initially', () => {
		expect(dictionary).toEqual({});
	});
});

describe('load', () => {
	it('should add definitions to the dictionary', () => {
		load(DEFINITIONS);
		expect(dictionary).toEqual(DEFINITIONS);
	});

	afterAll(() => {
		Object.keys(dictionary).forEach(key => delete dictionary[key]);
	});
});


describe('i18n', () => {
	beforeEach(() => {
		load(DEFINITIONS);
	});

	it('should return a text definition when used as a tag with template literals', () => {
		expect(i18n`submit`).toBe('Submit');
	});

	describe('when used with text definitions that are functions', () => {
		it('should use expressions in template literals as arguments', () => {
			expect(i18n`total${ 100 }`).toBe('Total: $100');
		});

		it('should support optional parentheses', () => {
			expect(i18n`total(${ 100 })`).toBe('Total: $100');
		});

		it('should support multiple arguments', () => {
			expect(i18n`total(${ null }, ${ 0 })`).toBe('Total: $0');
		});
	});

	it('should throw an exception when used with an invalid definition', () => {
		expect(() => i18n`foo`).toThrow();
	});

	afterEach(() => {
		Object.keys(dictionary).forEach(key => delete dictionary[key]);
	});
});