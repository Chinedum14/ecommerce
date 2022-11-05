import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51LzpSFDJiGttiavXN4bA3EsOF9SR776jjnWy9PYCF1lo5nFYzd7zUtQ5nkpJ4EdVRmLik8FvX6yoqwJqrlnXHliQ00fCSr9bFc');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // console.log(req.body);
    // console.log(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
    try {
      const params = {
        submit_type: 'pay',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1LzyHXDJiGttiavXqG7drJ5N' },
          { shipping_rate: 'shr_1LzyKMDJiGttiavX4DYVuAXa' },
        ],
        line_items: req.body.map((item) => {
          const img = item.image[0].asset._ref;

          const newImage = img.replace('image-', 'https://cdn.sanity.io/images/qejf7uhv/production/').replace('-webp', '.webp');

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [newImage],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity
          }
        }),
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      };
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}