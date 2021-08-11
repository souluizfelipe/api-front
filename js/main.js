const API_URL = 'http://localhost:8080/api/products';

const form = document.querySelector('#addForm');
const editForm = document.querySelector('#editForm');
const prodList = document.querySelector('.product-list');
const editSection = document.querySelector('#edit-section');


function getData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      let list = '';

      data.map(product => {
        return list += `
          <li>
            ${product.brand} - ${product.name} - $${product.price} - 
            <a 
              href="#" 
              class="edit-btn" 
              data-id="${product._id}"
              data-name="${product.name}"
              data-brand="${product.brand}"
              data-price="${product.price}"
            >
              [edit]
            </a>
            <a 
              href="#" 
              class="remove-btn" 
              data-id="${product._id}"
            >
              [remove]
            </a>
          </li>
        `
      });

      prodList.innerHTML = list;

      editBtnEvent();
      removeBtnEvent();
      
    });
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.forms['addForm'].name.value;
  const brand = document.forms['addForm'].brand.value;
  const price = document.forms['addForm'].price.value;


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

editForm.onsubmit = function(e) {
  e.preventDefault();

  const id = document.forms['editForm'].id.value;
  const name = document.forms['editForm'].name.value;
  const brand = document.forms['editForm'].brand.value;
  const price = document.forms['editForm'].price.value;

  console.log(id)
  console.log(name)
  console.log(brand)
  console.log(price)  

  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      brand,
      price,
    }),
  }).then(res => res.json())
    .then(data => {
      if(data.message === 'success'){
        form.reset();
        getData();
        editSection.classList.add('hidden');
        alert('produto editado com sucesso');
      } else {
        alert('Ops, algo de errado, tente novamente');
      };
    });

};

function editBtnEvent() {
  const editBtn = document.querySelectorAll('.edit-btn');

  editBtn.forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      editSection.classList.remove('hidden');

      const id = this.dataset.id;
      const name = this.dataset.name;
      const brand = this.dataset.brand;
      const price = this.dataset.price;

      document.forms['editForm'].id.value = id;
      document.forms['editForm'].name.value = name;
      document.forms['editForm'].brand.value = brand;
      document.forms['editForm'].price.value = price;

    };

  });
};

function removeBtnEvent() {
  const removeBtn = document.querySelectorAll('.remove-btn');

  removeBtn.forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      
      
      const id = this.dataset.id;
      
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      }).then(res => res.json())
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
};

getData();