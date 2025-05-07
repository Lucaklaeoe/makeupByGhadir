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

  suggestionsList.innerHTML = '';

  data.results.forEach(place => {
    const li = document.createElement('li');
    li.textContent = place.formatted;
    li.addEventListener('click', () => {
      input.value = place.address_line1;
      suggestionsList.innerHTML = '';
      autocompletePostalCode.value = place.postcode;
      autocompleteBy.value = place.country;
    });
    suggestionsList.appendChild(li);
  });
  window.addEventListener('click', () => {
    suggestionsList.innerHTML = '';
  });
  document.querySelectorAll('.check_if_autocompleted').forEach((input, index) => {
    input.addEventListener('blur', () => {
      if(input.value.includes(" ")) {
        document.querySelectorAll('.houseNumber')[index].value = input.value.split(' ')[1];
        input.value = input.value.split(' ')[0];
      }
    });
  })
  document.querySelectorAll('.check_if_adress_autocompleted').forEach(input => {
    input.addEventListener('blur', () => {
      const adress = document.getElementById('autocomplete_adresse');
      document.getElementById('autocomplete_house_number').value = adress.value.split(' ')[1];
      adress.value = adress.value.split(' ')[0];
    });
  })
});
