const fs = require('node:fs/promises')
const express = require('express')

const app = express();

class ProductManager {

    constructor(path) {
        this.products = [];
        this.productIdCounter = 0;
        this.errors = {
            ERROR_READING_FILE: 'Error al leer el archivo',
            ERROR_READING_FILE_ID: 'No se encontró el producto especificado',
            ERROR_WRITING_FILE: 'Error al escribir el archivo',
            ERROR_UPDATING_FILE: 'Error al actualizar el archivo',
            ERROR_DELETING_FILE: 'Error al eliminar el archivo',
        }
        this.path = path
    }

    // Metodo Async para Crear o Sobreescribir el archivo
    async WriteFile(productToWrite) {
        try {
            // Asynchronous code here
            if (productToWrite) {
                await fs.writeFile(this.path, JSON.stringify(productToWrite));
            } else {
                await fs.unlink(this.path)
            }


        } catch (error) {
            // Handle errors
            console.error('An error occurred:', this.errors.ERROR_WRITING_FILE);
            throw error; // Optionally, you can re-throw the error for further handling
        }
    }


    // Metodo Async para Crear o Sobreescribir el archivo
    async getProducts() {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8')
            if (fileContent) {
                return fileContent
            } else {
                throw new Error(this.errors.ERROR_READING_FILE);
            }
        } catch (error) {
            // Handle errors
            console.error('An error occurred:', this.errors.ERROR_READING_FILE);
            throw error; // Optionally, you can re-throw the error for further handling
        }
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
            this.WriteFile(this.products)
            console.log("Producto agregado:", product);
        }
    }


    async getProductById(Id) {

        try {
            const fileContent = await fs.readFile(this.path, 'utf-8')
            if (fileContent) {
                let productById = JSON.parse(fileContent).find(product => product.id === Id);
                if (!productById) {
                    throw new Error(this.errors.ERROR_READING_FILE_ID);
                } else {
                    return productById;
                }
            } else {
                throw new Error(this.errors.ERROR_READING_FILE);
            }
        } catch (error) {
            // Handle errors
            console.error('An error occurred:', this.errors.ERROR_READING_FILE);
            throw error; // Optionally, you can re-throw the error for further handling
        }
    }

    async updateProduct(id, fieldToUpdate, newValue) {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8');
            if (fileContent) {
                const productsFromFile = JSON.parse(fileContent);
                const productIndex = productsFromFile.findIndex(product => product.id === id);
                if (productIndex === -1) {
                    throw new Error(this.errors.ERROR_READING_FILE_ID);
                }

                // Update the specified field in the file data
                if (fieldToUpdate) {
                    productsFromFile[productIndex][fieldToUpdate] = newValue;
                } else {
                    // If fieldToUpdate is not provided, update the whole product object
                    const { title, description, price, thumbnail, code, stock } = newValue
                    const product = {
                        id,
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                    };
                    productsFromFile[productIndex] = product;
                }

                // Update the local this.products array
                const localProductIndex = this.products.findIndex(product => product.id === id);
                if (localProductIndex !== -1) {
                    if (fieldToUpdate) {
                        this.products[localProductIndex][fieldToUpdate] = newValue;
                    } else {
                        // If fieldToUpdate is not provided, update the whole product object
                        this.products[localProductIndex] = newValue;
                    }
                }

                // Write the updated data back to the file
                this.WriteFile(this.products);
                return `Producto ${id} actualizado correctamente`
            } else {
                throw new Error(this.errors.ERROR_READING_FILE);
            }
        } catch (error) {
            console.error('An error occurred:', this.errors.ERROR_UPDATING_FILE);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            // Read the file to get the current products
            const fileContent = await fs.readFile(this.path, 'utf-8');
            if (fileContent) {
                const productsFromFile = JSON.parse(fileContent);

                // Find the index of the product to delete
                const productIndex = productsFromFile.findIndex(product => product.id === id);

                if (productIndex === -1) {
                    throw new Error(this.errors.ERROR_READING_FILE_ID);
                }

                // Remove the product from the array
                productsFromFile.splice(productIndex, 1);

                // Update the file with the modified array
                await this.WriteFile(productsFromFile);

                // Update the local this.products array
                const localProductIndex = this.products.findIndex(product => product.id === id);
                if (localProductIndex !== -1) {
                    this.products.splice(localProductIndex, 1);
                }

                return `Product with ID ${id} has been deleted.`;
            } else {
                throw new Error(this.errors.ERROR_READING_FILE);
            }
        } catch (error) {
            console.error('An error occurred:', this.errors.ERROR_DELETING_FILE);
            throw error;
        }
    }
}



// TESTING DEL CODIGO
const filename = './src/ProductManager.json'
const productManager = new ProductManager(filename);

// productManager.addProduct(
//     "producto prueba",
//     "Este es un producto prueba",
//     200,
//     "Sin imagen",
//     "abc123",
//     25
// );


// productManager.addProduct(
//     "producto prueba 2",
//     "Este es un producto prueba 2",
//     300,
//     "Sin imagen 2",
//     "abc234",
//     30
// );

// productManager.addProduct(
//     "producto prueba 3",
//     "Este es un producto prueba 3",
//     450,
//     "Sin imagen 3",
//     "abc456",
//     30
// );


app.get('/products', (req, res) => {
    productManager.getProducts() // tiene que mostrar: "Productos iniciales: []"
        .then((fileContent) => {
            const products = JSON.parse(fileContent);
            try {
                const limit = parseInt(req.query.limit, 10);
                if (!isNaN(limit)) {
                    res.json(products.slice(0, limit))
                } else {
                    res.json(products)
                }
            } catch (error) {
                res.status(500).json({ error: 'Error al obtener los productos' })
            }
        })
        .catch((error) => {
            console.error('Error in async method:', error);
        });
}
)

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid, 10);
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});
app.listen(3000, () => console.log("Servidor arriba"))
// (async () => {
//     try {
//         // Update the product's price
//         await productManager.updateProduct(0, 'price', 666);

//         // Get the updated product
//         const updatedProduct = await productManager.getProductById(0);
//         console.log('Updated Product result:', updatedProduct);
//     } catch (error) {
//         console.error('Error in async method:', error);
//     }
//     // Delete product
//     await productManager.deleteProduct(0);
// })();




