import { Orders } from '../models/orders.js';
import { Products } from '../models/products.js';

export async function createOrder(req, res) {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Order must contain at least one product.'
            });
        }

        // Validate product IDs and quantities
        for (const item of items) {
            if (
                !item.product ||
                !/^[a-fA-F0-9]{24}$/.test(item.product) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: 'Invalid product ID or quantity.'
                });
            }
        }

        // Fetch actual products from the database
        const productIds = items.map(item => item.product);
        const uniqueProductIds = [...new Set(productIds)];

        const products = await Products.find({
            _id: { $in: uniqueProductIds }
        });

        if (products.length !== uniqueProductIds.length) {
            return res.status(400).json({
                message: 'One or more products do not exist.'
            });
        }

        // Build order items using database prices
        const productMap = new Map(
            products.map(product => [product.id, product])
        );

        const orderItems = items.map(item => {
            const product = productMap.get(item.product);

            return {
                product: product._id,
                quantity: item.quantity,
                price: product.price
            };
        });

        // Calculate total on the server
        const totalAmount = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Save the order for the authenticated user
        const order = await Orders.create({
            user: req.user.id,
            items: orderItems,
            totalAmount
        });

        return res.status(201).json({
            message: 'Order created successfully.',
            order
        });

    } catch (err) {
        console.error('createOrder error:', err);

        return res.status(500).json({
            message: 'Internal server error.'
        });
    }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Orders.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('Error fetching user orders:', err);

    return res.status(500).json({
      message: 'Failed to fetch orders.'
    });
  }
}

export async function getMyOrderById(req, res) {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        message: 'Invalid order ID.'
      });
    }

    const order = await Orders.findOne({
      _id: id,
      user: req.user.id
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.'
      });
    }

    return res.status(200).json({ order });
  } catch (err) {
    console.error('Error fetching order:', err);

    return res.status(500).json({
      message: 'Failed to fetch order.'
    });
  }
}