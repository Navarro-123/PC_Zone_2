
function addToCart(itemName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.push({ itemName, price });

    localStorage.setItem('cart', JSON.stringify(cart));

    renderCart();
	
	alert("I am an alert box!");
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(cart));

    renderCart();
}


function calculateTotal(cart) {
    return cart.reduce((total, item) => total + item.price, 0);
}


function renderCart() {
    const cartContainer = document.getElementById('cart');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartContainer.innerHTML = '<h3>Your Cart</h3>';
    if (cart.length === 0) {
        cartContainer.innerHTML += '<p>Cart is empty.</p>';
        return;
    }

    const cartList = document.createElement('ul');
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.itemName} - ₱${item.price} 
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartList.appendChild(listItem);
    });

    cartContainer.appendChild(cartList);


    const totalPrice = calculateTotal(cart);
    const totalElement = document.createElement('p');
    totalElement.textContent = `Total: ₱${totalPrice}`;
    cartContainer.appendChild(totalElement);
}


function getGeolocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

      
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(data => {
                const address = data.display_name || "Address not found";
        
                document.getElementById('address').value = address;
            })
            .catch(() => {
                alert("Unable to retrieve address.");
            });
    }, () => {
        alert("Unable to retrieve your location.");
    });
}


function fillAddressWithGeolocation() {
    getGeolocation();
}

function clearCart() {
    localStorage.removeItem('cart');
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    
 
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        clearCart();
    });
});



function showSummaryPopup() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to proceed.");
        return;
    }

    let summary = "";
    cart.forEach((item, index) => {
        summary += `
            <div class="item">
                <span>${index + 1}. ${item.itemName}</span>
                <span class="price">₱${item.price}</span>
            </div>
        `;
    });

    const totalPrice = calculateTotal(cart);

    // Open a new popup window
    const popupWindow = window.open("", "CartSummary", "width=400,height=500");

    popupWindow.document.write(`
        <html>
            <head>
                <title>Cart Summary</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    h2 {
                        color: #6a0dad;
                        margin-bottom: 20px;
                    }

                    .receipt {
                        background-color: #fff;
                        border: 1px solid #ddd;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        border-radius: 8px;
                        padding: 20px;
                        width: 100%;
                        max-width: 350px;
                    }

                    .item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        font-size: 14px;
                    }

                    .price {
                        font-weight: bold;
                        color: #6a0dad;
                    }

                    .total {
                        font-size: 18px;
                        font-weight: bold;
                        color: #6a0dad;
                        border-top: 2px solid #6a0dad;
                        margin-top: 15px;
                        padding-top: 10px;
                        text-align: right;
                    }

                    button {
                        background-color: #6a0dad;
                        color: #fff;
                        border: none;
                        padding: 10px 20px;
                        margin-top: 20px;
                        cursor: pointer;
                        font-size: 16px;
                        border-radius: 5px;
                    }

                    button:hover {
                        background-color: #571a91;
                    }
                </style>
            </head>
            <body>
                <div class="receipt">
		    <h2>Thank You For Buying</h2>
                    <h3>Receipt</h3>
                    ${summary}
                    <div class="total">Total: ₱${totalPrice}</div>
                </div>
                <button onclick="window.close()">Close</button>
            </body>
        </html>
    `);

    // Clear the cart after showing the popup
    clearCart();
}
