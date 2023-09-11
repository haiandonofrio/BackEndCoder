class ProductManager {

    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    setTitle(title) {
        this.product.title = title;
        return this; // Return the builder instance for method chaining
    }

    setDesciption(description) {
        this.product.description = description;
        return this;
    }

    setPrice(price) {
        this.product.price = price;
        return this;
    }

    setThumbnail(thumbnail) {
        this.product.thumbnail = thumbnail;
        return this;
    }

    setCode(code) {
        this.product.code = code;
        return this;
    }

    setStock(stock) {
        this.product.stock = stock;
        return this;
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        // Validamos que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        const productById = this.products.find(product => product.code === code);
        if (productById) {
            throw new Error('El producto ya existe')
        } else {
            // Agregamos el producto con un id autoincrementable
            const product = {
                id: this.productIdCounter++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };

            this.products.push(product);
            console.log("Producto agregado:", product);
        }
    }

    getProducts() {
        if (this.products) {
            console.log(this.products)
        } else {
            console.log('No existe ningún producto')
        }
    }

    getProductById(Id) {
        const productById = this.products.find(product => product.id === Id);
        if (!productById) {
            throw new Error('Product not found');
        } else {
            console.log(productById);
        }
    }
}

// TESTING DEL CODIGO

const productManager = new ProductManager();
console.log("Productos iniciales:", productManager.getProducts()); // tiene que mostrar: "Productos iniciales: []"

productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
);

console.log("Productos después de agregar uno:", productManager.getProducts()); // tiene que mostrar información sobre el producto agregado

// Intentamos agregar un producto con el mismo código
productManager.addProduct(
    "producto repetido",
    "Este es un producto repetido",
    150,
    "Sin imagen",
    "abc123",
    10
); // Debería mostrar un mensaje de error "El producto ya existe"

// Buscar un producto por ID
const foundProduct = productManager.getProductById(1);
console.log("Producto encontrado por ID:", foundProduct); // tiene que mostrar información sobre el producto encontrado

// Intentar buscar un producto inexistente por ID
const notFoundProduct = productManager.getProductById(99);  // tiene que mostrar un mensaje de error "Product not found"

