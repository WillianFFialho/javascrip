document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const budgetList = document.getElementById('budgetList');
    const totalAmount = document.getElementById('totalAmount');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');

    productForm.addEventListener('submit', addProduct);
    searchButton.addEventListener('click', searchProducts);

    loadStoredData();

    function addProduct(event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productQuantity = parseInt(document.getElementById('productQuantity').value);
        const productPrice = parseFloat(document.getElementById('productPrice').value);

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${productName} (${productQuantity}x)</span>
            <span>R$ ${calculateTotal(productQuantity, productPrice).toFixed(2)}</span>
            <button class="remove-btn">Remover</button>
        `;

        budgetList.appendChild(listItem);

        updateTotal();
        saveToLocalStorage(productName, productQuantity, productPrice);
        clearForm();
    }

    function calculateTotal(quantity, price) {
        return quantity * price;
    }

    function updateTotal() {
        const items = document.querySelectorAll('#budgetList li');
        let total = 0;

        items.forEach(item => {
            const price = parseFloat(item.children[1].textContent.substring(3));
            total += price;
        });

        totalAmount.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    budgetList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            event.target.parentElement.remove();
            updateTotal();
            removeFromLocalStorage(event.target.parentElement.querySelector('span').textContent);
        }
    });

    function clearForm() {
        document.getElementById('productName').value = '';
        document.getElementById('productQuantity').value = '';
        document.getElementById('productPrice').value = '';
    }

    function saveToLocalStorage(name, quantity, price) {
        const item = {
            name: name,
            quantity: quantity,
            price: price
        };

        let storedItems = localStorage.getItem('budgetItems');
        storedItems = storedItems ? JSON.parse(storedItems) : [];
        storedItems.push(item);
        localStorage.setItem('budgetItems', JSON.stringify(storedItems));
    }

    function removeFromLocalStorage(itemText) {
        const itemName = itemText.split('(')[0].trim();
        let storedItems = localStorage.getItem('budgetItems');
        storedItems = storedItems ? JSON.parse(storedItems) : [];

        const updatedItems = storedItems.filter(item => item.name !== itemName);
        localStorage.setItem('budgetItems', JSON.stringify(updatedItems));
    }

    function loadStoredData() {
        let storedItems = localStorage.getItem('budgetItems');
        storedItems = storedItems ? JSON.parse(storedItems) : [];

        storedItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} (${item.quantity}x)</span>
                <span>R$ ${calculateTotal(item.quantity, item.price).toFixed(2)}</span>
                <button class="remove-btn">Remover</button>
            `;
            budgetList.appendChild(listItem);
        });

        updateTotal();
    }

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const storedItems = getStoredItems();

        const filteredItems = storedItems.filter(item => item.name.toLowerCase().includes(searchTerm));

        displaySearchResults(filteredItems);
    }

    function getStoredItems() {
        const storedItems = localStorage.getItem('budgetItems');
        return storedItems ? JSON.parse(storedItems) : [];
    }

    function displaySearchResults(results) {
        searchResults.innerHTML = '';

        results.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} (${item.quantity}x)</span>
                <span>R$ ${calculateTotal(item.quantity, item.price).toFixed(2)}</span>
            `;
            searchResults.appendChild(listItem);
        });
    }
});
