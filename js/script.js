let navbar = document.querySelector('.navbar');
let searchForm = document.querySelector('.search-form');
let cartItem = document.querySelector('.cart-items-container');

// Toggle the menu
document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

// Toggle the search form
document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

// Toggle the cart
document.querySelector('#cart-btn').onclick = () => {
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

// Close the menu, search form, and cart on scroll
window.onscroll = () => {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    // cartItem.classList.remove('active');
}

// Define your cart items and delivery address variable
const cartItems = [];
let selectedDeliveryOption = 'pickup'; // Store the selected delivery option
let deliveryAddress = ''; // Variable to store the delivery address

// Function to display cart items
function displayCartItems() {
    const container = document.querySelector(".cart-items-container");
    container.innerHTML = ""; // Clear existing items

    // Check if cartItems is empty
    if (cartItems.length === 0) {
        container.innerHTML = `<div class="empty"><h3>Your Cart Is Empty.</h3></div>`;
        return;
    }

    let overallTotal = 0; // Initialize overall total

    // Create and append cart items
    cartItems.forEach(item => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item"; 

        const itemTotal = item.price * item.count; // Calculate total for this item
        overallTotal += itemTotal; // Update overall total

        cartItemDiv.innerHTML = `
            <span class="fas fa-times" onclick="removeCartItem(this)"></span>
            <img src="${item.image}" alt="${item.name}">
            <div class="content">
                <h3>${item.name}</h3>
                <div class="price">
                    <button class="minus-btn" onclick="decreaseItemCount('${item.name}')">-</button>
                    <span class="item-count"> x ${item.count}</span>
                    <button class="plus-btn" onclick="increaseItemCount('${item.name}')">+</button>
                </div>
                <div class="item-price">
                    <span class="individual-price">₱${item.price.toFixed(2)}</span>
                    <span class="item-total">(Total: ₱${itemTotal.toFixed(2)})</span>
                </div>
            </div>
        `;

        container.appendChild(cartItemDiv);
    });

    // Radio buttons for pickup or delivery
    const deliveryOptionsDiv = document.createElement("div");
    deliveryOptionsDiv.className = "delivery-options";
    deliveryOptionsDiv.innerHTML = `
        <hr>
        <h3 id="delivery-options">Pickup or Delivery?</h3>
        <div class="delivery-options">
            <label>
                <input type="radio" name="delivery-option" value="pickup" onclick="setDeliveryOption('pickup')"> Pickup
            </label>
            <label>
                <input type="radio" name="delivery-option" value="delivery" onclick="setDeliveryOption('delivery')"> Delivery
            </label>
        </div>
        <div id="delivery-details" style="display: none;">
            <h4>Enter Delivery Details:</h4>
            <textarea placeholder="Your Address" id="delivery-address" oninput="updateDeliveryAddress()">${deliveryAddress}</textarea>
        </div>
    `;
    container.appendChild(deliveryOptionsDiv); // Append the delivery options

    // Reapply the previously selected delivery option
    document.querySelector(`input[name="delivery-option"][value="${selectedDeliveryOption}"]`).checked = true;
    toggleDeliveryDetails(); // Ensure delivery details visibility is correct

    // Display overall total and checkout button
    const totalDiv = document.createElement("div");
    totalDiv.className = "overall-total";
    totalDiv.innerHTML = `
        <h3>Overall Total: <span class="overall-total-bold">₱${overallTotal.toFixed(2)}</span></h3>
        <a class="btn" id="checkout">Checkout Now</a>
    `;
    container.appendChild(totalDiv); // Append the overall total to the container

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("checkout");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        // Prompt for confirmation before proceeding
        const isConfirmed = confirm("Are you sure you want to checkout?");
    
        if (isConfirmed) {
            cartItem.classList.remove('active');
    
            // Generate the receipt and delivery info
            const receiptContent = generateReceipt(); // Get the receipt content
            const deliveryInfo = selectedDeliveryOption === 'delivery' 
                ? `Delivery to: <strong>${deliveryAddress}</strong>` 
                : 'Pickup option selected';
    
            // Set the modal content
            document.querySelector(".modal-content p").innerHTML = `Your order is now being prepared.<br><br>`;
            
            // Create a delivery info section
            const deliveryInfoSection = `
                <div class="delivery-info">
                    <h3>${deliveryInfo}</h3>
                </div>
            `;
            
            // Append receipt content to the modal
            document.querySelector(".modal-content p").innerHTML += deliveryInfoSection + `${receiptContent}`;
    
            // Add the total amount at the bottom of the modal
            const totalAmountSection = `
                <div class="total-amount-container">
                    <div class="total-amount">
                        <h3>Total: <strong>₱${overallTotal.toFixed(2)}</strong></h3>
                    </div>
                </div>
            `;
            document.querySelector(".modal-content p").innerHTML += totalAmountSection;
    
            modal.style.display = "block";
    
            // Clear cart items and reset delivery address
            cartItems.length = 0; // Clear the cart items array
            deliveryAddress = ''; // Reset delivery address
            selectedDeliveryOption = 'pickup'; // Reset delivery option to pickup
            updateDeliveryAddress(); // Clear the address input
            displayCartItems(); // Refresh the cart display
        }
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

function generateReceipt() {
    if (cartItems.length === 0) return "No items in your cart.";

    let receipt = `
        <strong>Receipt:</strong><br>
        <div class="receipt"> 
            <div class="receipt-header">
                <span>Item</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Amount</span>
            </div>
    `;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.count;
        receipt += `
            <div class="receipt-item">
                <span>${item.name}</span>
                <span>${item.count}</span>
                <span>₱${item.price.toFixed(2)}</span>
                <span>₱${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    receipt += `</div>`;
    return receipt;
}

// Function to set the selected delivery option
function setDeliveryOption(option) {
    selectedDeliveryOption = option; // Update the selected delivery option
    toggleDeliveryDetails(); // Call to update the delivery details visibility
}

// Function to update the delivery address
function updateDeliveryAddress() {
    const addressInput = document.getElementById("delivery-address");
    deliveryAddress = addressInput.value; // Store the value from the text area
}

// Function to toggle delivery details based on the selected delivery option
function toggleDeliveryDetails() {
    const deliveryDetails = document.getElementById("delivery-details");
    if (selectedDeliveryOption === "delivery") {
        deliveryDetails.style.display = "block"; // Show delivery details if "Delivery" is selected
    } else {
        deliveryDetails.style.display = "none"; // Hide delivery details if "Pickup" is selected
    }

    // Reapply the stored delivery address when the details are displayed
    const addressInput = document.getElementById("delivery-address");
    addressInput.value = deliveryAddress; // Ensure the text area shows the saved address
}

// Function to remove cart item
function removeCartItem(element) {
    const cartItemDiv = element.closest(".cart-item");
    const itemName = cartItemDiv.querySelector("h3").textContent;

    // Remove the item from the cartItems array
    const itemIndex = cartItems.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        cartItems.splice(itemIndex, 1);
    }
    
    // Re-display the cart items
    displayCartItems();
}

// Function to add items to cart
function addToCart(name, image, price) {
    // Check if item is already in cart
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.count += 1; // Increase count if already in cart
    } else {
        cartItems.push({ image, name, price, count: 1 });
    }
    displayCartItems();
}

// Function to increase item count
function increaseItemCount(name) {
    const item = cartItems.find(item => item.name === name);
    if (item) {
        item.count += 1; // Increase count
        displayCartItems(); // Update display
    }
}

// Function to decrease item count
function decreaseItemCount(name) {
    const item = cartItems.find(item => item.name === name);
    if (item) {
        item.count -= 1; // Decrease count
        if (item.count <= 0) {
            // Remove item if count is 0 or less
            removeCartItemByName(name);
        } else {
            displayCartItems(); // Update display
        }
    }
}

// Function to remove item by name
function removeCartItemByName(name) {
    const itemIndex = cartItems.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        cartItems.splice(itemIndex, 1);
    }
    displayCartItems(); // Update display
}

// Initial display
displayCartItems();

// Add event listeners to 'Add to Cart' buttons
document.querySelectorAll('.menu .btn').forEach(btn => {
    btn.onclick = (event) => {
        const parentBox = event.target.closest('.box');
        const itemName = parentBox.querySelector('h3').textContent;
        const itemPrice = parseFloat(parentBox.querySelector('.price').textContent.replace('₱', '').replace(',', ''));
        const itemImage = parentBox.querySelector('img').src;

        alert(itemName + " has been added to your cart.")
        addToCart(itemName, itemImage, itemPrice);
        cartItem.classList.add('active');
    };
});


// Get modal element
const modal = document.getElementById("aboutModal");

// Get open modal button
const aboutBtn = document.getElementById("about-btn");

// Get close button
const closeBtn = document.getElementsByClassName("close-about")[0];

// Listen for open click
aboutBtn.addEventListener("click", () => {
    modal.style.display = "block"; // Show the modal
});

// Listen for close click
closeBtn.addEventListener("click", () => {
    modal.style.display = "none"; // Hide the modal
});

// Listen for outside click
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none"; // Hide the modal if clicked outside
    }
});


// Get modal element
const modalContact = document.getElementById("contactModal");

// Get open modal button
const contactBtn = document.getElementById("contact-btn");

// Get close button
const closeBtnContact = document.getElementsByClassName("close-contact")[0];

// Listen for open click
contactBtn.addEventListener("click", () => {
    modalContact.style.display = "block"; // Show the modal
});

// Listen for close click
closeBtnContact.addEventListener("click", () => {
    modalContact.style.display = "none"; // Hide the modal
});

// Listen for outside click
window.addEventListener("click", (event) => {
    if (event.target === modalContact) {
        modalContact.style.display = "none"; // Hide the modal if clicked outside
    }
});


// Initialize the map
var map = L.map('map').setView([15.133264407425765, 120.59003245318613], 19);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Add a marker
var marker = L.marker([15.133264407425765, 120.59003245318613]).addTo(map);
marker.bindPopup(`
    <span style="font-size: 16px"><b>FOUR GUY'S COFFEE</b></span>
    <br>
    Holy Angel St, Angeles, 2009 Pampanga
    `
).openPopup();