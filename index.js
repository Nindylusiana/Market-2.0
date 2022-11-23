let products = [
  { id: 156272753, category: "Fast Food", name: "Noodle", price: 3000, stok: 6 },
  { id: 156272711, category: "Electronik", name: "Handphone", price: 9000, stok: 8 },
  { id: 156272770, category: "Cloth", name: "Jeans", price: 6000, stok: 3 },
  { id: 156272791, category: "Fruit", name: "Manggo", price: 4000, stok: 11 },
];

const categories = ["All", "Fast Food", "Electronik", "Cloth", "Fruit"];
let carts = [];

//calculate all item
let fnPayment = () => {
  let listPayment = carts.map((cart) => {
    let { id, category, name, price, qty } = cart;

    return `<p>${id} | ${category} | ${name}| ${price} X ${qty} = ${price * qty}</p>`;
  });
  let subTotal = 0;
  carts.forEach((cart) => {
    let { price, qty } = cart;
    subTotal += price * qty;
  });

  let ppn = subTotal * 0.1;
  let finalTotal = subTotal + ppn;

  let listDetail = listPayment.join("");
  let listTotal = `
  <h3>Sub Total Rp.${subTotal.toLocaleString("id")}</h3>
  <h3>PPN Rp.${ppn.toLocaleString("id")}</h3>
  <h3>Total Rp.${finalTotal.toLocaleString("id")}</h3>
  `;

  document.getElementById("payment").innerHTML = listDetail + listTotal;
};

// render list
let fnRenderList = (index) => {
  let listProduct = products.map((product) => {
    let { id, category, name, price, stok } = product;
    if (id != index) {
      return `
        <tr>
            <td>${id}</td>
            <td>${category}</td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${stok}</td>
            <td ><input type="button" value="Add" onclick="fnAdd(${id})"></td>
            <td ><input type="button" value="Delete" onclick="fnDelete(${id})"></td>
            <td ><input type="button" value="Edit" onclick = "fnEdit(${id})"></td>   
        </tr>`;
    }
    return `
    <tr>
        <td>${id}</td>
        <td>${category}</td>
        <td><input value="${name}" type="text" id="nameEdit"></td>
        <td><input value="${price}" type="text" id="priceEdit"></td>
        <td><input value="${stok}" type="text" id="stokEdit"></td>
        <td ><input type="button" value="Add" disabled></td>
        <td ><input type="button" value="Save" onclick="fnSave(${id})"></td>
        <td ><input type="button" value="Cancle" onclick="fnCancel()"></td>   
    </tr>`;
  });

  let listCategory = categories.map((category) => {
    return `<option value="${category}">${category}</option>`;
  });

  // data produk
  document.getElementById("render").innerHTML = listProduct.join("");

  // kategory
  document.getElementById("catFilter").innerHTML = listCategory.join("");
  document.getElementById("catInput").innerHTML = listCategory.join("");
};

//add to cart
let fnAdd = (index) => {
  let selectedProduct = products.find((product) => {
    return product.id == index;
  });

  if (selectedProduct.stok == 0) {
    alert("stok sudah habis!");
  } else {
    let foundCart = carts.find((cart) => {
      return cart.id == index;
    });

    if (!foundCart) {
      let { id, category, name, price } = selectedProduct;
      carts.push({ id, category, name, price, qty: 1 });
    } else {
      let idx = carts.findIndex((cart) => {
        return cart.id == index;
      });
      carts[idx].qty++;
    }
    let idx = products.findIndex((product) => {
      return product.id == index;
    });
    products[idx].stok--;
  }

  fnRenderList();
  fnRenderCart();
};

//edit
let fnEdit = (index) => {
  fnRenderList(index);
};
//cancel
let fnCancel = (index) => {
  fnRenderList();
};

//save
let fnSave = (index) => {
  let name = document.getElementById("nameEdit").value;
  let price = document.getElementById("priceEdit").value;
  let stok = document.getElementById("stokEdit").value;

  // find index
  let found = products.findIndex((product) => {
    return product.id == index;
  });
  products[found] = { ...products[found], name, price, stok };

  fnRenderList();
};

//delete
let fnDelete = (index) => {
  products = products.filter((product) => {
    return product.id != index;
  });
  fnRenderList();
};
//delete carts
let fnDeleteCart = (index) => {
  //idx pada arr product
  let idxProduct = products.findIndex((product) => {
    return product.id == index;
  });
  //idx pada arr cart
  let idxCart = carts.findIndex((cart) => {
    return cart.id == index;
  });

  // jumlahkan stok dgn qty pada arr carts
  products[idxProduct].stok += carts[idxCart].qty;

  carts = carts.filter((cart) => {
    return cart.id != index;
  });

  fnRenderList();
  fnRenderCart();
};

// render carts
let fnRenderCart = () => {
  let listCart = carts.map((cart) => {
    let { id, category, name, price, qty } = cart;
    return `
    <tr>
        <td>${id}</td>
        <td>${category}</td>
        <td>${name}</td>
        <td>${price}</td>
        <td>${qty}</td>       
        <td ><input type="button" value="Delete" onclick="fnDeleteCart(${id})"></td>   
    </tr>`;
  });
  document.getElementById("carts").innerHTML = listCart.join("");
};

// render filter
let fnRenderFilter = (arr) => {
  let listProduct = arr.map((product) => {
    let { id, category, name, price, stok } = product;
    return `
        <tr>
            <td>${id}</td>
            <td>${category}</td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${stok}</td>  
            <td ><input type="button" value="Add" onclick="fnAdd(${id})"></td>
            <td ><input type="button" value="Delete" onclick="fnDelete(${id})"></td>
            <td ><input type="button" value="Edit" onclick = "fnEdit(${id})"></td>                 
        </tr>`;
  });

  // data produk
  document.getElementById("render").innerHTML = listProduct.join("");
};

// reset filter
let fnResetFilter = () => {
  let inputTags = document.getElementsByName("txtFilter");
  for (const input of inputTags) {
    input.value = "";
  }
  fnRenderList();
};

// get data
let fnInputData = () => {
  const name = document.getElementById("nameInput").value;
  const price = parseInt(document.getElementById("priceInput").value);
  const category = document.getElementById("catInput").value;
  const stok = document.getElementById("stokInput").value;

  // create date
  const time = new Date();
  const id = time.getTime();

  // push new data
  products.push({ id, name, price, category, stok });
  //clean all text box
  document.getElementById("nameInput").value = "";
  document.getElementById("priceInput").value = "";
  document.getElementById("catInput").value = "";
  document.getElementById("stokInput").value = "";

  fnRenderList();
};

// filter name

let fnFilterName = () => {
  let keyWord = document.getElementById("nameFilter").value;

  //filtering
  let filterResult = products.filter((product) => {
    // ubah semua huruf jadi huruf kecil (lowercase), keyword dan nama product
    let nameLow = product.name.toLowerCase();
    let keyWordLow = keyWord.toLowerCase();

    return nameLow.includes(keyWordLow);
  });

  fnRenderFilter(filterResult);
};
//filter price
let fnFilterPrice = () => {
  let min = document.getElementById("min").value;
  let max = document.getElementById("max").value;

  let filterResult = products;
  // lakukan filter pada saat semua text min dan max tidak kosong
  if (!(min == "" || max == "")) {
    filterResult = products.filter((product) => {
      let { price } = product;
      return price >= min && price <= max;
    });
  }
  fnRenderFilter(filterResult);
};

// filter category

let fnFilterCategory = () => {
  let selectedCategory = document.getElementById("catFilter").value;

  let filterResult = products;

  if (selectedCategory != "All") {
    filterResult = products.filter((product) => {
      return product.category == selectedCategory;
    });
  }
  fnRenderFilter(filterResult);
};

fnRenderList();
