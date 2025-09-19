function addProduct() {
    const newProduct = {
        name: prompt("Введите название товара:", "Новый товар"),
        price: parseFloat(prompt("Введите цену товара:", "5000")),
        description: prompt("Введите описание товара:", "Описание товара"),
        categories: prompt("Введите категории (через запятую):", "Другое").split(",").map(c => c.trim())
    };

    if (!newProduct.name || isNaN(newProduct.price) || !newProduct.description) {
        alert("Ошибка: Введены некорректные данные.");
        return;
    }

    fetch("http://localhost:8080/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
    })
        .then(response => response.text())
        .then(alert)
        .catch(() => alert("Ошибка при добавлении товара!"));
}

function deleteProduct() {
    const id = prompt("Введите ID товара для удаления:");
    if (!id) return;

    fetch(`http://localhost:8080/delete/${id}`, { method: "DELETE" })
        .then(response => response.text())
        .then(alert)
        .catch(() => alert("Ошибка при удалении товара!"));
}

function editProduct() {
    const id = prompt("Введите ID товара для редактирования:");
    if (!id) return;

    fetch("http://localhost:3000/products")
        .then(response => {
            if (!response.ok) throw new Error("Ошибка загрузки товаров");
            return response.json();
        })
        .then(products => {
            let product = products.find(p => p.id == id);
            if (!product) {
                alert("Товар с таким ID не найден!");
                return;
            }

            const updatedProduct = {
                name: prompt("Введите новое название:", product.name) || product.name,
                price: parseFloat(prompt("Введите новую цену:", product.price)) || product.price,
                description: prompt("Введите новое описание:", product.description) || product.description,
                categories: prompt("Введите новые категории:", product.categories.join(", "))
            };

            if (updatedProduct.categories !== product.categories.join(", ")) {
                updatedProduct.categories = updatedProduct.categories.split(",").map(c => c.trim());
            } else {
                updatedProduct.categories = product.categories;
            }

            fetch(`http://localhost:8080/edit/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct)
            })
                .then(response => response.text())
                .then(alert)
                .catch(() => alert("Ошибка при редактировании товара!"));
        })
        .catch(() => alert("Ошибка загрузки товаров. Проверьте сервер!"));
}