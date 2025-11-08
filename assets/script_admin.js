
// Admin script for editing products.json in-browser
async function fetchProducts() {
  try {
    const res = await fetch('data/products.json?_=' + Date.now());
    return await res.json();
  } catch (e) {
    return [];
  }
}

function renderList(products){
  const list = document.getElementById('productList');
  list.innerHTML = '';
  products.forEach((p, idx) => {
    const item = document.createElement('div');
    item.className = 'product-item';
    item.innerHTML = `
      <img src="${p.image}" />
      <div style="flex:1">
        <strong>${p.name}</strong><div class="small">${p.id} • ${p.category} • ${p.price}</div>
        <div class="small">${p.description}</div>
      </div>
      <div class="actions">
        <button onclick="editProduct(${idx})">Edit</button>
        <button onclick="deleteProduct(${idx})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

let PRODUCTS = [];

async function initAdmin(){
  PRODUCTS = await fetchProducts();
  renderList(PRODUCTS);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById('addBtn').addEventListener('click', async ()=>{
  const id = document.getElementById('p_id').value.trim();
  const name = document.getElementById('p_name').value.trim();
  const price = document.getElementById('p_price').value.trim();
  const price_raw = parseFloat(document.getElementById('p_price_raw').value) || 0;
  const desc = document.getElementById('p_desc').value.trim();
  const category = document.getElementById('p_category').value.trim();
  const stock = parseInt(document.getElementById('p_stock').value) || 0;
  const url = document.getElementById('p_image_url').value.trim();
  const file = document.getElementById('p_image_file').files[0];

  let imagePath = url || 'images/placeholder.png';
  if(file){
    imagePath = await readFileAsDataURL(file);
  }

  if(!id || !name){ alert('Provide at least ID and name'); return; }

  PRODUCTS.push({
    id, name, price, price_raw, currency: 'INR', description: desc, image: imagePath, category, stock
  });
  renderList(PRODUCTS);
  clearForm();
});

function clearForm(){
  document.getElementById('p_id').value='';
  document.getElementById('p_name').value='';
  document.getElementById('p_price').value='';
  document.getElementById('p_price_raw').value='';
  document.getElementById('p_desc').value='';
  document.getElementById('p_category').value='';
  document.getElementById('p_stock').value='';
  document.getElementById('p_image_url').value='';
  document.getElementById('p_image_file').value='';
}

window.editProduct = function(idx){
  const p = PRODUCTS[idx];
  const newName = prompt('Product name', p.name);
  if(newName===null) return;
  p.name = newName;
  const newPrice = prompt('Price', p.price);
  if(newPrice!==null) p.price = newPrice;
  const newStock = prompt('Stock', p.stock);
  if(newStock!==null) p.stock = parseInt(newStock) || p.stock;
  PRODUCTS[idx] = p;
  renderList(PRODUCTS);
}

window.deleteProduct = function(idx){
  if(!confirm('Delete this product?')) return;
  PRODUCTS.splice(idx,1);
  renderList(PRODUCTS);
}

document.getElementById('downloadBtn').addEventListener('click', ()=>{
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PRODUCTS, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', 'products.json');
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
});

document.getElementById('importBtn').addEventListener('click', ()=>{
  const f = document.getElementById('importFile').files[0];
  if(!f){ alert('Choose a JSON file'); return; }
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(Array.isArray(data)){
        PRODUCTS = data;
        renderList(PRODUCTS);
        alert('Imported ' + PRODUCTS.length + ' products');
      } else {
        alert('Invalid JSON format (expected array)');
      }
    } catch(e){ alert('Error parsing JSON: ' + e.message); }
  };
  reader.readAsText(f);
});

document.getElementById('resetBtn').addEventListener('click', async ()=>{
  if(!confirm('Reset to sample products?')) return;
  PRODUCTS = await fetchProducts();
  renderList(PRODUCTS);
});

initAdmin();


// Publish to Netlify Function (commits products.json to GitHub repo)
document.getElementById('publishBtn')?.addEventListener('click', async ()=>{
  if(!confirm('Publish current products to GitHub (this will trigger Netlify deploy). Continue?')) return;
  try {
    const res = await fetch('/.netlify/functions/publish', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(PRODUCTS)
    });
    const text = await res.text();
    alert('Publish response: ' + text);
  } catch(e){
    alert('Publish failed: ' + e.message + '\nMake sure you have deployed this site on Netlify and set environment variables: REPO_OWNER, REPO_NAME, GITHUB_TOKEN.');
  }
});
