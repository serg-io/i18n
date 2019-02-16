<section>

## Introduction ##

This library allows you to use [tagged template literals](
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)
in your source code to generate content for different languages. This library provides the following
functions:

  * **`load`**: This function can be used to load definitions.
  * **`i18n`**: Template literals can be tagged with `i18n` to retrieve definitions that have been
    previously loaded using the `load` function.

</section>
<section>

## Installation ##

```bash
npm install @serg.io/i18n
```

</section>
<section>

## Example ##

You must first load the text definitions:

```javascript
import i18n, { load } from 'path/to/src/i18n.js';

// Load text definitions.
load({
	user: {
		firstName: 'First name',
		lastName: 'Last name',
	},
	submit: 'Submit',
});
```

Once your text definitions have been loaded, you can tag template literals using `i18n`. For
instance, the following example will change the `innerText` of the `button` with the string
"Submit":

```javascript
import i18n, { load } from 'path/to/src/i18n.js';

// Find the submit button.
const button = document.querySelector('button[type="submit"]');

// Change its text using i18n.
button.innerText = i18n`submit`;
```

</section>
<section>

## License ##

[MIT](https://github.com/serg-io/i18n/blob/master/LICENSE).

</section>