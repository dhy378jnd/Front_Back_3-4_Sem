document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("products");

    fetch("http://localhost:3000/products")
        .then(response => {
            if (!response.ok) throw new Error("Ошибка загрузки товаров");
            return response.json();
        })
        .then(products => {
            if (products.error) throw new Error(products.error);
            container.innerHTML = products.map(p => `
                <div class="product-card">
                    <h2>${p.name}</h2>
                    <p><strong>Цена:</strong> ${p.price} руб.</p>
                </div>
            `).join("");
        })
        .catch(error => {
            console.error("Ошибка загрузки данных:", error);
            container.innerHTML = "<p style='color: red;'>Ошибка загрузки товаров.</p>";
        });
});
