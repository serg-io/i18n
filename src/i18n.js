// All i18n definitions will be added to this object.
export const dictionary = {};

// RegExp to test if a string ends with an open square bracket "[" and an optional quote.
const OPEN_EXP = /\[\s*['"]?$/;

// RegExp to test if a string starts with an optional quote and a close square bracket "]".
const CLOSE_EXP = /^['"]?\s*\]/;

// RegExp used to replace bracket notation into dot notation.
const BRACKETS_EXP = /\[\s*['"]?(\w+)["']?\s*\]\.?/g;

/**
 * Adds the given i18n definitions into the internal dictionary. Uses `Object.assign` to copy all
 * properties of the given `definitions` object to the internal dictionary.
 *
 * @function load
 * @param {Object} definitions An object containing i18n definitions.
 * @returns {Object} Returns the same `definitions` object given as the first argument.
 */
export function load(definitions) {
	Object.assign(dictionary, definitions);
	return definitions;
}

/**
 * Template literals can be tagged with this function to retrieve i18n definitions.
 *
 * @function i18n
 * @param {string[]} strings String values used in the template literal.
 * @param {...*} [expressions] The resulting values of expressions used in the template literal.
 * @returns {string} The evaluated i18n definition.
 */
export default function i18n(strings, ...expressions) {
	let definition;
	const args = expressions.slice();

	// Trim all `strings` and start with the first string as the `key`.
	let keys = strings.map(k => k.trim());
	let key = keys[0];

	/**
	 * This loop inserts the expression values in their corresponding places within the key used in
	 * the template literal. If:
	 *
	 *     * `key` ends with an open square bracket "[", and
	 *     * the following string in `keys` starts with a close square bracket "]", and
	 *     * there are values remaining in `args`, then
	 *
	 * **remove** the corresponding value from `args` and append it to `key` along with the next
	 * string in `keys`. Repeat until any of the conditions above are no longer true.
	 */
	for (let i = 1; OPEN_EXP.test(key) && CLOSE_EXP.test(keys[i]) && args.length > 0; i++) {
		key += args.shift() + keys[i];
	}

	if (key.endsWith('(')) {
		key = key.substring(0, key.length - 1);
	}

	/**
	 * Replace square brackets with dots to be able to split the string into an array. For
	 * instance, it turns "foo[ 0].bar['baz']" into "foo.0.bar.baz".
	 */
	keys = key.replace(BRACKETS_EXP, (match, k, offset, str) => {
		const isAtStart = offset === 0;
		const isAtEnd = offset === (str.length - match.length);

		return `${ isAtStart ? '' : '.' }${ k }${ isAtEnd ? '' : '.' }`;
	});

	/**
	 * Split `keys` into an array of nested keys and use them to get the i18n definition from
	 * `dictionary`.
	 */
	try {
		definition = keys.split('.').reduce((obj, k) => obj[k], dictionary);
	} catch (ignore) {
		/**
		 * Exceptions thrown inside the try block indicate that the given definition key doesn't
		 * exist and it is handled by the following if statement.
		 */
	}

	if (definition === undefined) {
		throw new ReferenceError(`Could not find i18n definition for "${ key }".`);
	}

	return typeof definition === 'function' ? definition(...args) : definition;
}