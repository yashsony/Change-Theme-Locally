import {Shopify} from '@shopify/shopify-api';
import dotenv from 'dotenv';
dotenv.config();

const accesstoken = process.env.ACCESS_TOKEN;
console.log(accesstoken);

const client = new Shopify.Clients.Rest('aowlestore1.myshopify.com', accesstoken);
const data = await client.get({
  path: 'script_tags',
});

console.log(data);