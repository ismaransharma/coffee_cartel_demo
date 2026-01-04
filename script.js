let customers = [];
let activeCustomerId = null;
let modalItems = [];
let activeModalCategory = null;
let sideActiveCategory = null;

const categories = {
  Coffee: [
    { name: "Espresso", price: 120 },
    { name: "Americano", price: 150 },
    { name: "Cappuccino", price: 180 },
    { name: "Latte", price: 200 },
  ],
  Cigarette: [
    { name: "Surya", price: 25 },
    { name: "Gold Flake", price: 30 },
  ],
  Tea: [
    { name: "Milk Tea", price: 40 },
    { name: "Black Tea", price: 30 },
  ],
  Bakery: [
    { name: "Croissant", price: 120 },
    { name: "Muffin", price: 90 },
  ],
};

/* ---------- MODAL LOGIC ---------- */

function renderModalCategories() {
  const list = document.getElementById("modalCategoryList");
  list.innerHTML = "";
  Object.keys(categories).forEach((cat) => {
    list.innerHTML += `
            <button class="btn btn-outline-primary category-btn ${
              cat === activeModalCategory ? "active" : ""
            }"
                    onclick="selectModalCategory('${cat}')">
                ${cat}
            </button>
        `;
  });
}

function selectModalCategory(cat) {
  activeModalCategory = cat;
  renderModalCategories();
  renderModalProducts();
}

function renderModalProducts() {
  const list = document.getElementById("modalProductList");
  list.innerHTML = "";
  if (!activeModalCategory) return;

  categories[activeModalCategory].forEach((p) => {
    list.innerHTML += `
            <button class="btn btn-outline-dark"
                    onclick="addModalItem('${p.name}', ${p.price})">
                ${p.name} - Rs ${p.price}
            </button>
        `;
  });
}

function addModalItem(name, price) {
  let item = modalItems.find((i) => i.name === name);
  if (item) item.qty++;
  else modalItems.push({ name, price, qty: 1 });
  renderModalItems();
}

function renderModalItems() {
  const list = document.getElementById("modalItems");
  list.innerHTML = "";
  modalItems.forEach((i) => {
    list.innerHTML += `
            <li class="list-group-item d-flex justify-content-between">
                ${i.name} x ${i.qty}
                <span>Rs ${i.qty * i.price}</span>
            </li>
        `;
  });
}

function saveOrder() {
  const name =
    document.getElementById("customerName").value ||
    `Customer ${customers.length + 1}`;
  if (modalItems.length === 0) {
    alert("Add at least one item");
    return;
  }

  const customerId = Date.now();
  customers.push({
    id: customerId,
    name,
    items: JSON.parse(JSON.stringify(modalItems)),
    discount: 0,
  });

  activeCustomerId = customerId;

  modalItems = [];
  activeModalCategory = null;
  document.getElementById("customerName").value = "";
  document.getElementById("modalItems").innerHTML = "";
  document.getElementById("modalProductList").innerHTML = "";

  renderCustomers();
  renderOrder();
  bootstrap.Modal.getInstance(document.getElementById("addOrderModal")).hide();
}

/* ---------- MAIN SCREEN ---------- */

function renderCustomers() {
  const grid = document.getElementById("customerGrid");
  grid.innerHTML = "";
  customers.forEach((c) => {
    grid.innerHTML += `
            <div class="col-md-3">
                <div class="customer-card ${
                  c.id === activeCustomerId ? "active" : ""
                }"
                     onclick="selectCustomer(${c.id})">
                    ${c.name}
                </div>
            </div>
        `;
  });
}

function selectCustomer(id) {
  activeCustomerId = id;
  renderCustomers();
  renderOrder();
}

/* ---------- ORDER PANEL ---------- */

function renderOrder() {
  const customer = customers.find((c) => c.id === activeCustomerId);
  if (!customer) return;

  document.getElementById(
    "orderTitle"
  ).innerText = `${customer.name} - Order Items`;

  const list = document.getElementById("orderItems");
  list.innerHTML = "";

  let subtotal = 0;

  customer.items.forEach((i, index) => {
    const line = i.qty * i.price;
    subtotal += line;

    list.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${i.name}</strong><br>
                    Rs ${i.price}
                </div>

                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary"
                            onclick="changeQty(${index}, -1)">−</button>

                    <span>${i.qty}</span>

                    <button class="btn btn-sm btn-outline-secondary"
                            onclick="changeQty(${index}, 1)">+</button>
                </div>

                <span>Rs ${line}</span>
            </li>
        `;
  });

  const discount = Number(document.getElementById("discountInput").value) || 0;
  document.getElementById("orderTotal").innerText = Math.max(
    subtotal - discount,
    0
  );
}

function changeQty(index, change) {
  const customer = customers.find((c) => c.id === activeCustomerId);
  if (!customer) return;

  customer.items[index].qty += change;
  if (customer.items[index].qty <= 0) customer.items.splice(index, 1);

  renderOrder();
}

/* ---------- SLIDE PANEL CONTROL ---------- */

function openAddItemPanel() {
  if (!activeCustomerId) {
    alert("Select a customer first");
    return;
  }
  document.getElementById("addItemPanel").classList.add("open");
  renderSideCategories();
}

function closeAddItemPanel() {
  document.getElementById("addItemPanel").classList.remove("open");
  sideActiveCategory = null;
  document.getElementById("sideProductList").innerHTML = "";
}

/* ---------- SIDE PANEL CATEGORIES ---------- */

function renderSideCategories() {
  const list = document.getElementById("sideCategoryList");
  list.innerHTML = "";
  Object.keys(categories).forEach((cat) => {
    list.innerHTML += `
            <button class="btn btn-outline-primary"
                    onclick="selectSideCategory('${cat}')">
                ${cat}
            </button>
        `;
  });
}

function selectSideCategory(cat) {
  sideActiveCategory = cat;
  renderSideProducts();
}

function renderSideProducts() {
  const list = document.getElementById("sideProductList");
  list.innerHTML = "";
  list.innerHTML = "<hr />";
  categories[sideActiveCategory].forEach((p) => {
    list.innerHTML += `
            <button class="btn btn-outline-dark"
                    onclick="addItemToCustomer('${p.name}', ${p.price})">
                ${p.name} - Rs ${p.price}
            </button>
        `;
  });
}

function addItemToCustomer(name, price) {
  const customer = customers.find((c) => c.id === activeCustomerId);
  if (!customer) return;

  let item = customer.items.find((i) => i.name === name);
  if (item) item.qty++;
  else customer.items.push({ name, price, qty: 1 });

  renderOrder();
}

/* ---------- DEFAULT DATA ---------- */

customers = [
  {
    id: 1,
    name: "Ram",
    discount: 0,
    items: [
      { name: "Espresso", price: 120, qty: 2 },
      { name: "Croissant", price: 120, qty: 1 },
    ],
  },
  {
    id: 2,
    name: "Sita",
    discount: 0,
    items: [{ name: "Latte", price: 200, qty: 1 }],
  },
];

activeCustomerId = 1;

renderCustomers();
renderOrder();
renderModalCategories();

document.getElementById("discountInput").addEventListener("input", renderOrder);
