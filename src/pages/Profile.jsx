import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function Profile() {
      const { state } = useLocation();
      const [customers, setCustomers] = useState([]);
      const [toSendMoney, setToSendMoney] = useState(false);
      const [inputData, setInputData] = useState({sendTo: -1, amount: null})
      const [transaction, setTransaction] = useState({ send: [], receive: [] });


      const getTransactionDetail = () => {
            axios
                  .get(`https://transaction-app-system.azurewebsites.net/api/transaction-history/${state.customerId}`)
                  .then(function (response) {
                        setTransaction(response.data);
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      };

      const getClientsName = () =>{
            axios
                  .get(`https://transaction-app-system.azurewebsites.net/api/customers/name`)
                  .then(function (response) {
                        setCustomers(response.data)
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      }

      const sendMoney = () =>{
            axios
                  .post(`https://transaction-app-system.azurewebsites.net/api/send-money`, 
                        {
                              "customerToId": parseInt(inputData.sendTo),
                              "customerById": parseInt(state.customerId),
                              "transactionAmount": inputData.amount
                        }
                  )
                  .then(function (response) {
                        getTransactionDetail();

                        state.currentBalance = state.currentBalance - inputData.amount;

                        setToSendMoney(false);
                        setInputData({sendTo: -1, amount: null});

                        Swal.fire('Saved!', '', 'success')
                  })
                  .catch(function (error) {
                        Swal.fire(error.message, '', 'error')
                  });
      }

      const submitSendMoney = (e)=>{
            e.preventDefault();

            Swal.fire({
                  title: 'Do you want to save the changes?',
                  showDenyButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Save',
                  denyButtonText: `Don't save`,
            }).then((result) => {
                  if (result.isConfirmed) {
                        sendMoney()
                  } 
                  else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                  }
            })           
      }

      const inputChangeHandler = (event)=>{
            const id = event.target.id;
            const value = event.target.value;

            setInputData(previousState =>{ return{...previousState, [id]: value} })
      }

      useEffect(() => {
            getTransactionDetail();
            getClientsName();
      }, []);

      return (
            <div className="profile_container">
                   <div className="profile">
                        <h2>{state.name}</h2>
                        <hr />

                        <div className="profile__detail">
                              <span>
                                    <h4>customerId</h4>
                                    <h4>Email</h4>
                                    <h4>currentBalance</h4>
                              </span>

                              <span>
                                    <p>{state.customerId}</p>
                                    <p>{state.email}</p>
                                    <p>{state.currentBalance}</p>
                              </span>
                        </div>
                        
                        <div className="profile__footer">
                              {!toSendMoney && (
                                    <button 
                                          onClick={()=>setToSendMoney(previousState => !previousState)}
                                    >Send money</button>
                              )}

                              {toSendMoney && (
                                    <form className="send__inputs__container" onSubmit={submitSendMoney}>
                                          <section>
                                                <span>
                                                      <label htmlFor="amount">Amount</label>
                                                      <input 
                                                            id="amount" 
                                                            required 
                                                            type={'number'} 
                                                            value={inputData.amount}
                                                            placeholder="enter amount...." 
                                                            onChange={inputChangeHandler}
                                                      />
                                                </span>

                                                <span>
                                                      <label htmlFor="sendTo">Customer</label>
                                                      <select 
                                                            id="sendTo" 
                                                            value={inputData.sendTo} 
                                                            onChange={inputChangeHandler}
                                                      >
                                                            <option value={-1}>select customer</option>
                                                            {customers.map((customer, index) =>{return(
                                                                  <option 
                                                                        key={index} 
                                                                        value={customer.customerId}
                                                                  >{customer.name}</option>  
                                                            )})}
                                                      </select>
                                                </span>
                                          </section>
                                          
                                          <section className="send__inputs__container__buttons">
                                                <button type="submit">Send</button>
                                                <button 
                                                      className="close__button" 
                                                      onClick={()=>setToSendMoney(previousState => !previousState)}
                                                >Close</button>
                                          </section>
                                          
                                    </form>
                              )}
                              
                        </div>
                  </div>

                  <div className="statement">
                        <div className="send__statement">
                              <h2>Send Statements</h2>
                              <hr />

                              <table>
                                    <thead>
                                          <tr>
                                                <th>Transaction Id</th>
                                                <th>Date</th>
                                                <th>Send To</th>
                                                <th>Total Amount</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          {transaction.send.map((transaction, index) => {
                                                return (
                                                <tr key={index}>
                                                      <th>{transaction.transactionId}</th>
                                                      <td>{transaction.transactionDate}</td>
                                                      <td>{transaction.customerToId}</td>
                                                      <td className="send__amount">
                                                            {transaction.transactionAmount}
                                                      </td>
                                                </tr>
                                                );
                                          })}
                                    </tbody>
                              </table>
                        </div>

                        <div className="received__statement">
                              <h2>Received Statements</h2>
                              <hr />
                              
                              <table>
                                    <thead>
                                          <tr>
                                                <th>Transaction Id</th>
                                                <th>Date</th>
                                                <th>Received From</th>
                                                <th>Total Amount</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          {transaction.receive.map((transaction, index) => {
                                                return (
                                                      <tr key={index}>
                                                            <th>{transaction.transactionId}</th>
                                                            <td>{transaction.transactionDate}</td>
                                                            <td>{transaction.customerToId}</td>
                                                            <td className="received__amount">
                                                                  {transaction.transactionAmount}
                                                            </td>
                                                      </tr>
                                                );
                                          })}
                                    </tbody>
                              </table>
                        </div>

                  </div>
            </div>
      );
}

export default Profile;
