const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsConstainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const adressInput = document.getElementById("adress");
const adressWarn = document.getElementById("adress-warn");

let cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
  updateCartModal();
    cartModal.style.display = "flex";
})

//fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
   if(event.target === cartModal){
    cartModal.style.display = "none";
   }
})

//fechar modal pelo btn do modal
closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = "none";
})

//pegar item do carrinho
menu.addEventListener("click", function(){
    let parentButton = event.target.closest(".add-to-card-btn");
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
       addCart(name, price);
    }
})

// funcao add no carrinho 
function addCart(name, price){
  const existingItem = cart.find(item => item.name === name)
  if(existingItem){
  //se tiver mais de um item com mesmo nome, add + um
      existingItem.quantity += 1;
  
}else{
  cart.push({
    name,
    price,
    quantity: 1,
  })
}
updateCartModal()

}

//atualiza o carrinho
function updateCartModal(){
   cartItemsConstainer.innerHTML = "";
   let total = 0;

   cart.forEach(item =>{
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")


    cartItemElement.innerHTML = 
    `<div class= "flex items-center justify-between">
    <div>
    <p class="font-medium">${item.name}</p>
    <p>Qtd:${item.quantity}</p>
    <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
    </div>
    <div>

    <button class="remove-from-cart-btn" data-name="${item.name}">
      Remover
    </button>
    </div>
    </div>`

    total += item.price * item.quantity;

    cartItemsConstainer.appendChild(cartItemElement);
   })

   cartTotal.textContent = total.toFixed(2).toLocaleString("pt-Br", {
    style: "currency",
    currency: "BRL"
   });

   cartCounter.innerHTML = cart.length;
}

//funçao para remover item do carrinho
cartItemsConstainer.addEventListener("click", function(event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name");
    removeItemCart(name)
  }
})

function  removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];

    if(item.quantity > 1){
      item.quantity -= 1;

          updateCartModal();
          return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }

}

//pegar endereço

adressInput.addEventListener("input", function(event) {
   let inputValue = event.target.value;

   if(inputValue !== ""){
    adressInput.classList.remove("border-red-500")
    adressInput.classList.add("flex");
   
   }
   //
})

//finalizar pedido

checkoutBtn.addEventListener("click", function(){
     
  const isOpen = checkRestaurantBurguer();
  if(!isOpen){
    alert("Restaurante Fechado no Momento!")
    return;

    //enviar pedido para o whats
  }


  if(cart.length === 0) return;
  if(adressInput.value === ""){
    adressWarn.classList.remove("hidden");
    adressInput.classList.add("border-red-500");
    return;
  }

  //enviar pedido para api do whats
  const cartItems = cart.map((item) => {
    return (
      `Pedido: ${item.name} /
       Quantidade: (${item.quantity}) /
       Preço: R$${item.price} |` 
    )

  }).join("");


  const message = encodeURIComponent(cartItems)
  const phone = "12992025492"
  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}` , "_blank");
  cart = [];
  adressInput.value = "";
  updateCartModal();
 
});

function checkRestaurantBurguer(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
  // true restaurante esta aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantBurguer();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
}else{
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}

