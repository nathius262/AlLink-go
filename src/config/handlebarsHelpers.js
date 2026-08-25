// src/config/handlebarsHelpers.js
import truncate from 'truncate-html';

export default function registerHelpers(handlebars) {
  handlebars.registerHelper('gt', (a, b) => a > b);
  handlebars.registerHelper('lt', (a, b) => a < b);
  handlebars.registerHelper('eq', (a, b) => a === b);
  handlebars.registerHelper('notEqual', (a, b) => a !== b);
  handlebars.registerHelper('add', (a, b) => a + b);
  handlebars.registerHelper('subtract', (a, b) => a - b);
  handlebars.registerHelper('not', value => !value);
  handlebars.registerHelper('findPrimaryOrFirst', function (images) {
    const primary = images.find(img => img.is_primary);
    return primary || images[0];
  });

  handlebars.registerHelper('findAlternateImage', function (images) {
    const mainImage = images.find(img => img.is_primary) || images[0];
    return images.find(img => img.url !== mainImage.url) || mainImage;
  });
  handlebars.registerHelper('range', (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  });
  handlebars.registerHelper('truncate', (text, wordCount) => {
    if (typeof text !== 'string') return '';
    const words = text.split(' ');
    return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
  });
  handlebars.registerHelper('truncateHTML', (html, wordCount) => {
    if (typeof html !== 'string') return '';

    // Strip HTML tags to count words correctly
    const textOnly = html.replace(/<[^>]+>/g, '');
    const words = textOnly.split(/\s+/);

    if (words.length <= wordCount) {
      return html; // no need to truncate
    }

    // Take first N words and rebuild safe HTML around them
    const truncatedText = words.slice(0, wordCount).join(' ');

    // Truncate the original HTML at the word boundary
    return truncate(html, truncatedText.length, { ellipsis: '...' });
  });

  handlebars.registerHelper('has', (set, value) => set.has(value));
  handlebars.registerHelper('anyImageIsPrimary', images => images.some(image => image.is_primary));
  handlebars.registerHelper('hasRoleByName', function (roles, roleName, options) {
    const hasRole = roles && roles.some(role => role.name === roleName);
    return hasRole ? options.fn(this) : options.inverse(this);
  });
  handlebars.registerHelper('set', function (varName, varValue, options) {
    if (!options.data.root) options.data.root = {};
    options.data.root[varName] = varValue;
  });
  handlebars.registerHelper('contains', function (categoryId, categoryArray) {
    if (!categoryArray || !Array.isArray(categoryArray)) return false;

    return categoryArray.some(function (category) {
      return category.id === categoryId;
    });
  });
  handlebars.registerHelper('stripTags', function (html) {
    return html.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  });
  handlebars.registerHelper('formatDate', function (date) {
    return new Date(date).toLocaleDateString();
  });
  handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context || {});
  });

  handlebars.registerHelper('firstLetter', function (str) {
    // Check if the input is a valid, non-empty string
    if (typeof str === 'string' && str.length > 0) {
      return str.charAt(0);
    }
    return ''; // Return an empty string if input is invalid or empty
  });
  handlebars.registerHelper('formatNumber', (value, decimals = 0) => {
    if (value === null || value === undefined || value === '') {
      return '0';
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return '0';
    }

    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: Number(decimals),
      maximumFractionDigits: Number(decimals),
    }).format(number);
  });

  handlebars.registerHelper('formatCurrency', (value, currency = 'NGN') => {
    if (value === null || value === undefined || value === '') {
      return '₦0';
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return '₦0';
    }

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(number);
  });
  handlebars.registerHelper('repeat', function (count, options) {
    const output = [];

    const total = Number(count);

    if (!Number.isInteger(total) || total <= 0) {
      return '';
    }

    for (let i = 0; i < total; i++) {
      output.push(options.fn(this));
    }

    return output.join('');
  });
  handlebars.registerHelper('subtract', function (a, b) {
    return Number(a) - Number(b);
  });
  handlebars.registerHelper('addOne', function (value) {
    return Number(value) + 1
  });
  handlebars.registerHelper('uppercase', function (value) {
    return String(value || '').toUpperCase()
  });
}
