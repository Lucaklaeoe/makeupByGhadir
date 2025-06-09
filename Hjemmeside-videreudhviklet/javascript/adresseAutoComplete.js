const input = document.getElementById('autocomplete_adresse');
const suggestionsList = document.getElementById('autocomplete_suggestions');
const autocompletePostalCode = document.getElementById('autocomplete_postal_code');
const autocompleteBy = document.getElementById('autocomplete_by');
const apiKey = '4185f197618f4737856f9e0180d5dcc0';

input.addEventListener('input', async () => {
  const query = input.value;
  if (query.length < 5) return;
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&lang=en&limit=5&type=street&filter=countrycode:auto&format=json&apiKey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  //console.log(data);
  suggestionsList.innerHTML = '';

  data.results.forEach(place => {
    const li = document.createElement('li');
    li.textContent = place.formatted;
    li.addEventListener('click', () => {
      input.value = place.address_line1;
      suggestionsList.innerHTML = '';
      autocompletePostalCode.value = place.postcode;
      autocompleteBy.value = place.city;
    });
    suggestionsList.appendChild(li);
  });
  const handleClick = () => {
    suggestionsList.innerHTML = '';
    console.log('click');
    window.removeEventListener('click', handleClick);
  };
  window.addEventListener('click', handleClick);
});
