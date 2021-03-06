import _ from 'lodash';
import { newlineStrRegex, spacesRegex } from './regex';

export function snakeToFriendly(string) {
  return string
    .charAt(0).toUpperCase() + string.slice(1)
    .replace(/(_\w)/g, (matches) => ` ${matches[1].toUpperCase()}`);
}

export function slugify(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function snakeToCamel(string) {
  return string.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
}

/**
 * Replace characters from the middle of a string with an ellipsis to make it
 * fit a given length.
 *
 * e.g. 'supercalafragilisticexpialidocious' -> 'super...ocious'
 *
 * @param {String} string - string to shorten
 * @param {Number} maxLen - final string length
 */
export function shrinkToFit(string, targetLen) {
  const len = string.length;
  const chunkLen = (targetLen - 3) / 2;

  if (len <= targetLen || targetLen < 3) {
    return string;
  }

  return `${string.slice(0, chunkLen)}...${string.slice(len - chunkLen)}`;
}

/**
 * Converts a comma separated string into an array
 */
export function stringToArray(string) {
  string = _.trim(string, ' ,'); // strip whitespace and commas
  if (!string) {
    return [];
  }

  return string.split(',').map((item) => _.trim(item));
}

export function stringifyTypeaheadfilter(filter) {
  const subaccount = filter.type === 'Subaccount' ? `:${filter.id}` : '';
  return `${filter.type}:${filter.value}${subaccount}`;
}

// @see why we don't use regex to remove tags, https://stackoverflow.com/a/1732454
export function stripTags(html) {
  const div = document.createElement('div');
  const space = ' ';

  div.innerHTML = html;

  // innerText handles spacing much better than textContent, specifically line breaks are replaced
  // with spaces instead of completely removed
  return (div.innerText || div.textContent || '')
    .replace(newlineStrRegex, space) // extra credit since html could have newlines
    .replace(spacesRegex, space) // avoid multiple spaces between words
    .trim();
}

export function decodeBase64(str) {
  try {
    return atob(str);
  } catch (e) {
    return undefined; // ignore parsing error
  }
}
