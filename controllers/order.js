const {Order, CartItem} = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec((error, order) => {
        if(error || !order) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        req.order = order;
        next();
    })
}

exports.create = (req, res) => {
    console.log("create order: ", req.body.order );
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if(error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        res.json(data);
    });
};

exports.listOrder = (req, res) => {
    Order.find()
    .populate('user', "_id name address")
    .sort("-created")
    .exec((err, orders) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(orders);
    })
};

exports.getStatusValue = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(order);
        }
        )
}