const API_URL = 'http://localhost:8080/api/products'

const Main = {
  init: function () {
    this.getData();
    this.cacheSelectors();
    this.bindEvents();
    Click_Events.eventsCacheSelectors();
  },
  
  cacheSelectors: function () {
    this.$prodList = document.querySelector('.product-list');
    this.$addForm = document.querySelector('#addForm');
    this.$editForm = document.querySelector('#editForm');
    this.$modalAddBtn = document.querySelector('.add-product-btn');
    this.$addItemModal = document.querySelector('#addItemModal');
    this.$editItemModal = document.querySelector('#editItemModal');
    this.$cancelBtn = document.querySelector('.cancel-btn');
    this.$prodAddSuccess = document.querySelector('.prod-add-success');
  },
  
  bindEvents: function() {
    this.$addForm.onsubmit = this.Events.addForm_submit.bind(this);
    this.$editForm.onsubmit = this.Events.editForm_submit.bind(this);
    this.$modalAddBtn.onclick = Click_Events.modalAddBtn_click.bind(this);
    this.$cancelBtn.onclick = Click_Events.cancelBtn_click.bind(this);
  },

  getData: function () {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        let list = '';

        data.map(product => {
          return list += `
            <li class="product-item">
              ${product.brand} - ${product.name} - $${product.price} -
              <a 
                href="#" 
                class="edit-button" 
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

        this.$prodList.innerHTML = list;

        Click_Events.editBtn_click();
        Click_Events.removeBtn_click();
        
      });
  },

  Events: {
    addForm_submit: function (e) {
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
            this.$addForm.reset();
            this.$addItemModal.classList.add('hidden');

            this.$prodAddSuccess.textContent = "Product successfully added"
            
            setTimeout(() => {
              this.$prodAddSuccess.classList.remove('success-active');
            }, 2000);

            this.getData();
          } else {
            alert('Ops, deu algum erro, tente novamente');
          }
        })
      });

    },

    editForm_submit: function (e) {
      e.preventDefault();
  
      const id = document.forms['editForm'].id.value;
      const name = document.forms['editForm'].name.value;
      const brand = document.forms['editForm'].brand.value;
      const price = document.forms['editForm'].price.value;
  
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
          if (data.message === 'success') {
            this.$editForm.reset();
            this.getData();
            Click_Events.$editSection.classList.add('hidden');
            this.$editItemModal.classList.add('hidden');
            this.$prodAddSuccess.textContent = "Product successfully edited"
            this.$prodAddSuccess.classList.add('success-active');

            setTimeout(() => {
              this.$prodAddSuccess.classList.remove('success-active');
            }, 2000);
          } else {
            alert('Ops, algo de errado, tente novamente');
          };
        });
    },
  },
};


const Click_Events = {
  eventsCacheSelectors: function(){
    this.$editSection = document.querySelector('#edit-section');
    this.$editBtn = document.querySelectorAll('.edit-button');
  },

  modalAddBtn_click: function (e) {
    e.preventDefault();
    this.$addItemModal.classList.remove('hidden');
    this.$addItemModal.classList.add('active-modal');
  },
  
  editBtn_click: function (e) {
    const editBtn = document.querySelectorAll('.edit-button');

    editBtn.forEach(btn => {
      btn.onclick = function (e) {
        e.preventDefault();
        Main.$editItemModal.classList.toggle('hidden');
        Main.$editItemModal.classList.toggle('active-modal');

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
  },

  removeBtn_click: function (e) {
    const removeBtn = document.querySelectorAll('.remove-btn');

    removeBtn.forEach(btn => {
      btn.onclick = function (e) {
        e.preventDefault();

        const id = this.dataset.id;

        fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        }).then(res => res.json())
          .then(data => {
            if (data.message === 'success') {
              
              Main.$prodAddSuccess.textContent = "Product removed with success"
              Main.$prodAddSuccess.classList.add('success-active');
              
              setTimeout(() => {
                Main.$prodAddSuccess.classList.remove('success-active');
              }, 2000);
              
              Main.getData();
            } else {
              alert('Ops, ocorreu um erro');
            };
          });

      };
    });
  },

  cancelBtn_click: function (e) {
    e.preventDefault();

    this.$addItemModal.classList.add('hidden');
    this.$addItemModal.classList.remove('active-modal');
    this.$addForm.reset();
    
    this.$editItemModal.classList.add('hidden');
    this.$editItemModal.classList.remove('active-modal');
    this.$editForm.reset();
  },
};

Main.init();