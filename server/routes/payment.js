const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");


router.post("/fetchPlan", (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        })
        const plan_id = req.body.id;
        instance.plans.fetch(plan_id, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something went Wrong!' });
            }
            res.status(200).json({ data: order });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server Error 2!" });
    }
})

router.post("/plans", (req, res) => {
    try {

        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        })

        const { subPeriod, subInterval, amount, currency } = req.body;


        instance.plans.create({
            period: subPeriod,
            interval: subInterval,
            item: {
                name: "Test plan - Weekly",
                amount: amount * 100,
                currency: currency,
                description: "Description for the test plan - Weekly"
            }
        }, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something went Wrong!' });
            }
            res.status(200).json({ data: order });
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server Error 1 !" });
    }

})

router.post("/fetchSubscriptions", (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        })
        const sub_id = req.body.id;
        instance.subscriptions.fetch(sub_id, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something went Wrong!' });
            }
            res.status(200).json({ data: order });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server Error 2!" });
    }
})

router.post("/subscriptions", (req, res) => {

    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        })

        const {
            id,
            interval,
            email,
            phone
        } = req.body;

        console.log("running subs1")
        const params = {
            plan_id: id,
            total_count: 2,
            quantity: 1,
            customer_notify: 1,
            // start_at: 1580453311,
            // expire_by: 1580626111,
            // addons: [
            //     {
            //         item: {
            //             name: "Delivery Charges",
            //             amount: 300,
            //             currency: "INR"
            //         }
            //     }
            // ],
            notes: {
                notes_key_1: "Tea, Earl Grey, Hot",
                notes_key_2: "Tea, Earl Grey… decaf",
            },
            notify_info: {
                notify_phone: phone,
                notify_email: email
            }


        }
        instance.subscriptions.create(params, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something went Wrong!' });
            }
            res.status(200).json({ data: order });
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server Error 2!" });
    }
})

//subscription verify
router.post("/subverify", async (req, res) => {
    try {
        const {
            razorpay_subscription_id, 
            
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const crypt = crypto.createHmac('sha256', process.env.KEY_SECRET)
        const digest = crypt.update(razorpay_payment_id + '|' + razorpay_subscription_id).digest('hex');
        if (razorpay_signature === digest) {
            return res.status(200).json({ messsage: "Payment Verified Successfully" });
        } else {
            return res.status(400).json({ message: "Invalid Signature sent" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server Error !" });
    }
})


router.post("/fetchOrder", (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        })
        const order_id = req.body.id;
        instance.orders.fetch(order_id, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something went Wrong!' });
            }
            res.status(200).json({ data: order });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server Error 2!" });
    }
})

router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        })

        const options = {
            amount: req.body.amount * 100,
            currency: req.body.currency,
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something went Wrong!' });
            }
            res.status(200).json({ data: order });
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server Error !" });
    }
})

//payment verify
router.post("/verify", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.KEY_SECRET).update(sign.toString()).digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ messsage: "Payment Verified Successfully" });
        } else {
            return res.status(400).json({ message: "Invalid Signature sent" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal Server Error !" });
    }
})



module.exports = router;