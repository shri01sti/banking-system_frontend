import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../button.css";
function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  const getCustomers = () => {
    axios
      .get("https://transaction-app-system.azurewebsites.net/api/customers")
      .then(function (response) {
        // handle success
        setCustomers(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div className="customer__container">
      <h1>Customer Details</h1>

      <table id="customers">
        <thead>
          <tr>
            <th>customerId</th>
            <th>Name</th>
            <th>Email</th>
            <th>Current Balance</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer, index) => {
            return (
              <tr key={index}>
                <td>{customer.customerId}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.currentBalance}</td>
                <td className="text-center">
                  <button
                    className="button-51"
                    role="button"
                    onClick={() => {
                      navigate("profile", { state: customer });
                    }}
                  >
                    view profile
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
