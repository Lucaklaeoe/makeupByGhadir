const input = document.getElementById('autocomplete-adresse');
const suggestionsList = document.getElementById('autocomplete-suggestions');
const autocompletePostalCode = document.getElementById('autocomplete-postal-code');
const autocompleteBy = document.getElementById('autocomplete-by');
const apiKey = '4185f197618f4737856f9e0180d5dcc0';

input.addEventListener('input', async () => {
  const query = input.value;
  if (query.length < 5) return;
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&lang=da&filter=countrycode:dk&limit=5&types=house&apiKey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();
  console.log(data);

  // Clear old suggestions
  suggestionsList.innerHTML = '';

  // Show new suggestions
  data.features.forEach(place => {
    const li = document.createElement('li');
    li.textContent = place.properties.formatted;
    li.addEventListener('click', () => {
      input.value = place.properties.formatted;
      suggestionsList.innerHTML = '';
      autocompletePostalCode.value = place.properties.postcode;
      autocompleteBy.value = place.properties.country;
    });
    suggestionsList.appendChild(li);
  });
  window.addEventListener('click', () => {
    suggestionsList.innerHTML = '';
  });
});
