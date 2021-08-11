const form = document.querySelector('#inputForm');
const prodList = document.querySelector('.product-list');
const API_URL = 'http://localhost:8080/api/products';

function getData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let list = '';

      data.map(item => {
        return list += `<li> ${item.brand} - ${item.name} - $${item.price} </li>`
      })

      prodList.innerHTML = list;
    });
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.forms['inputForm'].name.value;
  const brand = document.forms['inputForm'].brand.value;
  const price = document.forms['inputForm'].price.value;


  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      brand,
      price,
    }),
  }).then(res => {
    res.json().then(data => {
      if (data.message === 'success') {
        form.reset()
        getData();
        alert('Cadastro relizado com sucesso');
      } else {
        alert('Ops, deu algum erro, tente novamente');
      }
    })
  });

});

getData();