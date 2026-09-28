import Stripe from 'stripe';
import { env } from '../env.js';

export const StripeClient = new Stripe(env.stripeSecretKey);