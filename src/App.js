import axios from 'axios';
import { useState } from 'react';
import './App.css';

function App() {
  const [book , setBook] = useState({
    name : "The Fault in Our Stars " ,
    author : "John Green ",
    img:"https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg" ,
    price: 250 ,
  })

const initPayment = (data) => {
  const options = {
    amount : data.amount ,
    currency : data.currency ,
    name : book.name ,
    description : "test tranction " ,
    image : book.img ,
    order_id : data.id ,
    handler : async(response) =>{
      try {
        const verifyUrl = "http://localhost:8080/api/payment/verify";
        const {data} = await axios.post(verifyUrl , response);
        console.log(data) ;
      } catch (error) {
        console.log(error)
      }
    },
    theme:{
      color : "#3399cc"
    }
  };
  const rzp1 = new window.Razorpay(options);
  rzp1.open();
}

const paymentSubscription = async(cust) => {
  try {
    const subscriptionUrl = "http://localhost:8080/api/payment/subscriptions";
    const {data} = await axios.post(subscriptionUrl , {id:cust.id});
    console.log(data);
  } catch (error) {
    console.log(error)
  }
}

const handlePayment = async()=>{
  try {
    const orderUrl = "http://localhost:8080/api/payment/orders";
    const {data} = await axios.post(orderUrl , {amount:book.price});
    console.log(data);

    paymentSubscription(data.data) ;
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className='App'>
      <div className='book_container'>
        <img src= {book.img} alt= "book_img" className='book_img' />
        <p className='book_name'> {book.name}</p>
        <p className='book_author'>By {book.author}</p>
        <p className='book_price'>
          Price : <span>&#x2089; {book.price}</span>
        </p>
        <button className='buy_btn' onClick={handlePayment}>Buy now</button>
      </div>

    </div>
  )
}

export default App