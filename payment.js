//get the patient id from urlparams
const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('patientId');
//payment in lab test
const searchLabTestForPayment = async () => {

    // Get the appointment id
    const appointmentId = document.getElementById("appointmentID").value;
    console.log(appointmentId);
    if (!appointmentId) {
        alert("Please enter a valid appointment ID.");
        return;
    }

    //send the appointment id to the server
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId }),
    };


    // Get the lab test details
    try {
        //send the appointment id to the server
        const url = "http://localhost:3000/labTestForPayment"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        console.log(response);
        const labTestPayment = await response.json();
        console.log(labTestPayment);
        //if no lab test is pending
        if (labTestPayment.length == 0) {
           //create a header and display the message
            const labTestPaymentElement = document.getElementById("labTestPaymentTable");
            labTestPaymentElement.innerHTML = "";
            const header = document.createElement("h2");
            header.textContent = "No Pending Lab Test Payment Details";
            //add the header to the div
            labTestPaymentElement.appendChild(header);
            return;
        }
        // Display the lab test details
        const labTestPaymentElement = document.getElementById("labTestPaymentTable");
        labTestPaymentElement.innerHTML = "";
        const table = document.createElement("table");
        //add the table headers
        const tableHeader = document.createElement("tr");
        for (const key in labTestPayment[0]) {
            const th = document.createElement("th");
            th.textContent = key;
            tableHeader.appendChild(th);
        }
        table.appendChild(tableHeader);
        //add the table rows
        for (const labTest of labTestPayment) {
            const row = document.createElement("tr");
            for (const key in labTest) {
                const cell = document.createElement("td");
                cell.textContent = labTest[key];
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        const header = document.createElement("h2");
        header.textContent = "Lab Test Payment Details";
        labTestPaymentElement.appendChild(header);
        labTestPaymentElement.appendChild(table);


    } catch (error) {
        console.error(error);
    }
}
//see doctor payment
const searchDoctorPayment= async () => {
    // Get the appointment id
    const appointmentId = document.getElementById("appointmentID").value;
    console.log(appointmentId);
    if (!appointmentId) {
        alert("Please enter a valid appointment ID.");
        return;
    }

    //send the appointment id to the server
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId }),
    };
    try {
        //send the appointment id to the server
        const url = "http://localhost:3000/doctorPayment"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        console.log(response);
        const doctorPayment = await response.json();
        console.log(doctorPayment);
        //if no doctor payment is pending
        if (doctorPayment.length == 0) {
            //create a header and display the message
            const doctorPaymentElement = document.getElementById("doctorPaymentTable");
            doctorPaymentElement.innerHTML = "";
            const header = document.createElement("h2");
            header.textContent = "No Pending Doctor Payment Details";
            //add the header to the div
            doctorPaymentElement.appendChild(header);
            return;
        }
        // Display the lab test details
        const doctorPaymentElement = document.getElementById("doctorPaymentTable");
        doctorPaymentElement.innerHTML = "";
        const table = document.createElement("table");
        //add the table headers
        const tableHeader = document.createElement("tr");
        for (const key in doctorPayment[0]) {
            const th = document.createElement("th");
            th.textContent = key;
            tableHeader.appendChild(th);
        }
        table.appendChild(tableHeader);
        //add the table rows
        for (const doctor of doctorPayment) {
            const row = document.createElement("tr");
            for (const key in doctor) {
                const cell = document.createElement("td");
                cell.textContent = doctor[key];
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        const header = document.createElement("h2");
        header.textContent = "Doctor Payment Details";
        doctorPaymentElement.appendChild(header);
        doctorPaymentElement.appendChild(table);
    } catch (error) {
        console.error(error);
    }
}   

//see total payment
const seeTotalPayment = async () => {
    // Get the appointment id
    const appointmentId = document.getElementById("appointmentID").value;
    console.log(appointmentId);
    if (!appointmentId) {
        alert("Please enter a valid appointment ID.");
        return;
    }

    //send the appointment id to the server
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId }),
    };
    let totalCost = 0;
    try {
        //send the appointment id to the server
        const url = "http://localhost:3000/totalPayment"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        console.log(response);
        const totalPayment = await response.json();
        console.log(totalPayment);
        //if no total payment is pending
        //or a null row is returned
         totalCost = totalPayment[0].TOTALCOST;
        if (totalPayment.length == 0 || totalPayment[0].TOTALCOST == 0) {
            //create a header and display the message
            const totalPaymentElement = document.getElementById("totalPaymentTable");
            totalPaymentElement.innerHTML = "";
            const header = document.createElement("h2");
            header.textContent = "No Pending Total Payment Details";
            //add the header to the div
            totalPaymentElement.appendChild(header);
            return;
        }
        // Display the lab test details
        const totalPaymentElement = document.getElementById("totalPaymentTable");
        totalPaymentElement.innerHTML = "";
        const table = document.createElement("table");
        //add the table headers
        const tableHeader = document.createElement("tr");
        for (const key in totalPayment[0]) {
            const th = document.createElement("th");
            th.textContent = key;
            tableHeader.appendChild(th);
        }
        table.appendChild(tableHeader);
        //add the table rows
        for (const payment of totalPayment) {
            const row = document.createElement("tr");
            for (const key in payment) {
                const cell = document.createElement("td");
                cell.textContent = payment[key];
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        const header = document.createElement("h2");
        header.textContent = "Total Payment Details";
        totalPaymentElement.appendChild(header);
        totalPaymentElement.appendChild(table);
    } catch (error) {
        console.error(error);
    }
    //add a button at last to pay
    const payButton = document.createElement("button");
    payButton.id = "pay";
    payButton.textContent = "Pay";
    payButton.onclick = pay;
    //get the div named Payment
    const totalPaymentElement = document.getElementById("Payment");
    //if totalcost is not 0
    console.log("Total Cost")
    console.log(totalCost);
    if (totalCost != 0) {
    totalPaymentElement.appendChild(payButton);
    }

}
const pay = async () => {
    //create a input field naming Amount
    const amount = document.createElement("input");
    amount.type = "text";
    amount.placeholder = "Enter the amount";
    amount.id = "amount";
    //create a button to pay
    const payButton = document.createElement("button");
    payButton.textContent = "Pay";
    payButton.onclick = payAmount;
    //get the div named Payment
    const totalPaymentElement = document.getElementById("Payment");
    totalPaymentElement.appendChild(amount);
    totalPaymentElement.appendChild(payButton);
    //remove the other pay button
    const payButton1 = document.getElementById("pay");
    payButton1.remove();
}
const payAmount = async () => {
    //get the amount
    const amount = document.getElementById("amount").value;
    //get the appointment id
    const appointmentId = document.getElementById("appointmentID").value;
    //send the amount to the server
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: parseInt(appointmentId), amount: parseInt(amount) }),
    };
    try {
        //send the amount to the server
        const url = "http://localhost:3000/payVerification"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        console.log(response);
        const payment = await response.json();
        //if status is true 200 is returned
        if (response.status == 200) {
            alert("Payment Successful You have paid " + amount + " Taka. You can see the prescription and lab test reports now.");
        }
        else {
            alert("Payment Unsuccessful Payment Failed! Pay Right Amount.");
        }
    } catch (error) {
        console.error(error);
    }
}

//show all unpaid amount 
const seeAllUnpaidAmount = async () => {
    //send the patient id to the server
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId }),
    };
    try {
        //send the patient id to the server
        const url = "http://localhost:3000/unpaidAmount"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        console.log(response);
        const unpaidAmount = await response.json();
        console.log(unpaidAmount);
        //if no unpaid amount is pending
        if (unpaidAmount.length == 0) {
            //create a header and display the message
            const unpaidAmountElement = document.getElementById("unpaidAmountTable");
            unpaidAmountElement.innerHTML = "";
            const header = document.createElement("h2");
            header.textContent = "No Pending Unpaid Amount Details";
            //add the header to the div
            unpaidAmountElement.appendChild(header);
            return;
        }
        // Display the lab test details
        const unpaidAmountElement = document.getElementById("unpaidAmountTable");
        unpaidAmountElement.innerHTML = "";
        const table = document.createElement("table");
        //add the table headers
        const tableHeader = document.createElement("tr");
        for (const key in unpaidAmount[0]) {
            const th = document.createElement("th");
            th.textContent = key;
            tableHeader.appendChild(th);
        }
        table.appendChild(tableHeader);
        //add the table rows
        for (const amount of unpaidAmount) {
            const row = document.createElement("tr");
            for (const key in amount) {
                const cell = document.createElement("td");
                cell.textContent = amount[key];
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        const header = document.createElement("h2");
        header.textContent = "Unpaid Amount Details";
        unpaidAmountElement.appendChild(header);
        unpaidAmountElement.appendChild(table);
    } catch (error) {
        console.error(error);
    }
}

