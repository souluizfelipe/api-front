const API_URL = 'http://localhost:8080/api/products';

const form = document.querySelector('#inputForm');
const prodList = document.querySelector('.product-list');


function getData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let list = '';

      data.map(product => {
        return list += `
          <li>
           ${product.brand} - ${product.name} - $${product.price} - 
           <a href="#" class="remove-btn" data-id="${product._id}">[excluir]</a>
          </li>
        `
      });

      prodList.innerHTML = list;

      const removeBtn = document.querySelectorAll('.remove-btn');
      removeBtn.forEach(btn => {
        btn.onclick = function(e) {
          e.preventDefault();

          const id = this.dataset.id;

          fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
          })
            .then(res => res.json())
            .then(data => {
              if(data.message === 'success'){
                getData();
                alert('Cadastro removid com sucesso');
              } else {
                alert('Ops, ocorreu um erro');
              };
            });
        };
      });
      
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