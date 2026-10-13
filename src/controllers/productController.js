import { Products } from '../models/products.js';

//Displaying products, with filters optionally
export async function getProducts(req,res) {
    try {
        const {category} = req.query;
        const filter = {};

        if (category) {
            if(!['Men','Women'].includes(category)) {
                return res.status(400).json({
                    message: 'Category must be men or women'
                });
            }
            filter.category = category;
        }

        const products = await Products.find(filter);

        return res.status(200).json({
            count: products.length,
            products
        });
    } catch (err) {
        console.error('getProducts error:', err);

        return res.status(500).json({
            message: 'Internal server error.'
        });
    }
}

//Used to get specific products by id ()
export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        //The regex is used to validate it to check hexadeximal strings of length 24
        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(400).json({
                message: 'Invalid product ID.'
            });
        }

        const product = await Products.findById(id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found.'
            });
        }

        return res.status(200).json({ product });

    } catch (err) {
        console.error('getProductById error:', err);

        return res.status(500).json({
            message: 'Internal server error.'
        });

    }
}