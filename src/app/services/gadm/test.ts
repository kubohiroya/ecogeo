const test =
  '<option value="BES_Bonaire, Saint Eustatius and Saba_2">Bonaire, Saint Eustatius and Saba</option>\n';
const matches = test.match(
  /option value="?<iso>(\w\w\w)_[\w+]_?<level>([\d])">?<countryName>([\w+])</g,
);
console.log(JSON.stringify(matches, null, '  '));
