
async function loadProducts(){
  const res = await fetch('data/products.json');
  const products = await res.json();
  const container = document.getElementById('products');
  if(!container) return;
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h4>${p.name}</h4>
      <p>${p.description}</p>
      <div class="price">${p.price}</div>
      <div style="margin-top:8px;">
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
        <button onclick="viewProduct('${p.id}')">View</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function addToCart(id){
  alert('Add to cart: ' + id + ' (Cart not implemented in this demo)');
}

function viewProduct(id){
  // In this simple demo, open product detail in new window using query param
  window.location.href = 'product.html?id=' + encodeURIComponent(id);
}

async function showFeatured(){
  // load featured items and show on index if needed
  const res = await fetch('data/products.json');
  const products = await res.json();
  const featured = document.getElementById('featured');
  if(!featured) return;
  featured.innerHTML = '';
  products.slice(0,3).forEach(p => {
    const el = document.createElement('div');
    el.className = 'card';
    el.style.display='inline-block'; el.style.width='30%'; el.style.margin='0 1%';
    el.innerHTML = `<img src="${p.image}" alt="${p.name}" /><h4>${p.name}</h4><div class="price">${p.price}</div>`;
    featured.appendChild(el);
  });
}

async function loadProductDetail(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if(!id) return;
  const res = await fetch('data/products.json');
  const products = await res.json();
  const p = products.find(x => x.id === id);
  if(!p) return;
  const main = document.querySelector('main.container');
  main.innerHTML = `
    <h2>${p.name}</h2>
    <img src="${p.image}" alt="${p.name}" style="max-width:300px;height:auto" />
    <p>${p.description}</p>
    <div class="price">${p.price}</div>
    <p>Stock: ${p.stock}</p>
    <p><button onclick="addToCart('${p.id}')">Add to Cart</button></p>
  `;
}

document.addEventListener('DOMContentLoaded', function(){
  loadProducts();
  showFeatured();
  loadProductDetail();
});
