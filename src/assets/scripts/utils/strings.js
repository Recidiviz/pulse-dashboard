// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

function capitalizeWords(str) {
  return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase());
}

function nullSafeToLowerCase(str) {
  if (!str) {
    return str;
  }
  return str.toLowerCase();
}

function replaceAll(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}

function normalizeLabel(str) {
  const label = replaceAll(str, '_', ' ');
  return capitalizeWords(label);
}

function normalizeAppPathToTitle(str) {
  let updatedString = str;

  while (updatedString.indexOf('/', 1) !== -1) {
    const nextSlash = updatedString.indexOf('/', 1);
    updatedString = updatedString.substring(nextSlash);
  }

  const noSlash = replaceAll(updatedString, '/', '');
  if (!noSlash) {
    return null;
  }

  const capitalLetters = noSlash.match(/[A-Z]/g);
  let noSlashWithSpaces = '';
  for (let i = 0; i < noSlash.length; i += 1) {
    const char = noSlash.charAt(i);
    if (capitalLetters && capitalLetters.includes(char)) {
      noSlashWithSpaces = noSlashWithSpaces.concat(' ');
    }
    noSlashWithSpaces = noSlashWithSpaces.concat(char);
  }

  return capitalizeWords(noSlashWithSpaces);
}

export {
  capitalizeWords,
  normalizeAppPathToTitle,
  nullSafeToLowerCase,
  replaceAll,
  normalizeLabel,
};
