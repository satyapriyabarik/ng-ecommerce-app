import { gql } from "@apollo/client";

const PRODUCTS_QUERY = gql`query { getProducts { _id title price imageUrl, category, descriptions } }`;
const PRODUCT_QUERY = gql`
  query Product($id: String!) {
    product(id: $id) {
      _id
      title
      descriptions
      price
      category
      stock
      imageUrl
    }
  }
`;
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        fullName
        address
        phone
        email
        role
      }
    }
  }
`;
const REGISTER_MUTATION = gql`mutation Register($email: String!, $password: String!, $role: String!, $fullName: String!, $address: String!, $phone: String!) { register(email: $email, password: $password, role: $role, fullName:$fullName, address:$address, phone:$phone) }`;
const CREATE_RAZORPAY_ORDER = gql`mutation CreateRazorpayOrder($amount: Float!) {
  createRazorpayOrder(amount: $amount) {
    id
    amount
    currency
  }
}`;
const CREATE_PRODUCT = gql`
  mutation CreateProduct($title: String!, $price: Float!, $imageUrl: String!, $category: String!, $descriptions: String!) {
    createProduct(title: $title, price: $price, imageUrl: $imageUrl, category: $category, descriptions: $descriptions) {
      _id
      title
      price
      imageUrl
      category
      descriptions
    }
  }
`;
const CREATE_PAYMENT_LINK = gql`
  mutation CreatePaymentLink($amount: Float!) {
    createPaymentLink(amount: $amount) {
      id
      short_url
      status
    }
  }
`;

const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($razorpay_order_id: String!, $razorpay_payment_id: String!, $razorpay_signature: String!) {
    verifyPayment(razorpay_order_id: $razorpay_order_id, razorpay_payment_id: $razorpay_payment_id, razorpay_signature: $razorpay_signature)
  }
`;
const PLACE_ORDER_MUTATION = gql`
   mutation PlaceOrder($paymentId: String!, $paymentMethod: String!) {
    placeOrder(paymentId: $paymentId, paymentMethod: $paymentMethod)
  }
`;
const ADD_TO_CART = gql`
  mutation AddToCart($productId: String!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity)
  }
`;

const UPDATE_CART_QUANTITY = gql`
  mutation UpdateCartQuantity($productId: String!, $quantity: Int!) {
    updateCartQuantity(productId: $productId, quantity: $quantity)
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: String!) {
    removeFromCart(productId: $productId)
  }
`;

const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

// ✅ Query to get actual cart after mutations
const GET_CART = gql`
  query GetCart {
    getCart {
        product {
          _id
          title
          price
          imageUrl
        }
        quantity
    }
  }
`;
const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      total
      paymentMethod
      paymentId
      createdAt
      items {
        product {
          _id
          title
          price
          imageUrl
        }
        quantity
      }
    }
  }
`;
const ME_QUERY = gql`
  query Me {
    me {
      _id
      fullName
      email
      address
      phone
      role
      createdAt

    }
  }
`;
const SEARCH_PRODUCTS = gql`
query SearchProducts($keyword: String!) {
  searchProducts(keyword: $keyword) {
   _id
    title
    imageUrl
    price
  }
}
`;
export { PRODUCTS_QUERY, PRODUCT_QUERY, LOGIN_MUTATION, REGISTER_MUTATION, CREATE_RAZORPAY_ORDER, CREATE_PRODUCT, CREATE_PAYMENT_LINK, VERIFY_PAYMENT, PLACE_ORDER_MUTATION, ADD_TO_CART, GET_CART, UPDATE_CART_QUANTITY, REMOVE_FROM_CART, CLEAR_CART, GET_MY_ORDERS, ME_QUERY, SEARCH_PRODUCTS };