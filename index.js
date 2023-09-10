class Product {
    constructor(id, title, desc, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = desc;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {

    #Products = [];
    #id = 0;

    // constructor(title, desc, price, thumbnail, code, stock) {

    //     this.product = new Product(this.#id++,title, desc, price, thumbnail, code, stock);
    //     this.#Products.push(this.product);

    // }

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
    addProduct(title, desc, price, thumbnail, code, stock) {
        const productById = this.#Products.find(product => product.code === code);
        if (productById) {
            throw new Error('El producto ya existe')
        } else {
            this.product = new Product(this.#id++, title, desc, price, thumbnail, code, stock);
            this.#Products.push(this.product);
        }
    }

    getProducts() {
        console.log(this.#Products)
    }

    getProductById(Id) {
        const productById = this.#Products.find(product => product.id === Id);
        if (!productById) {
            throw new Error('Product not found');
        } else {
            console.log(productById);
        }
    }
}

// Usage
// const product = new Product('Remera','Remera Blanca',400,'FotoRemeraBlanca',1,10)

// console.log(product)
const productManager = new ProductManager()
productManager.getProducts();
productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin Imagen', 'abc123', 25);
// productManager1.build();
productManager.getProducts();
productManager.getProductById(2)
// console.log(product);
// productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin Imagen', 'abc123', 25);


