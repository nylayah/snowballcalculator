// Global Variables
let loans = [];
let totalPrincipal = 0;
let smallestLoan = {
    id: '',
    principal: Infinity
};
let minimumPayments = [];
let additionalPayment = 0;


// find the loan with the least amount
function findSmallestLoan() {
    for (let i = 0; i < loans.length; i++) {
        if (loans[i].principal < smallestLoan.principal) {
            smallestLoan.id = loans[i].id;
            smallestLoan.principal = loans[i].principal;
        }
    }
    return smallestLoan;
}

// prompt for additional payment (monthly) for the loan with the least amount
function getAdditionalPayment() {
    additionalPayment = prompt(`Enter additional payment for loan ${smallestLoan.id}`);
    return additionalPayment;
}

// sum of principal amounts of all loans
function sumOfPrincipals() {
    totalPrincipal = 0;
    for (let i = 0; i < loans.length; i++) {
        totalPrincipal += loans[i].principal;
    }
    return totalPrincipal;
}

// Extract loan data
function getLoanData() {
    const loanIDs = document.querySelectorAll('.loan-id'); //replace query with actual element
    const loanPrincipals = document.querySelectorAll('.loan-principal'); //replace query with actual element

    for (let i = 0; i < loanIDs.length; i++) {
        loans.push({
            id: loanIDs[i].innerText,
            principal: loanPrincipals[i].innerText
        });
    }
}

// Prompt for minimum payment (monthly) for each loan
function minimumPaymentConfirmation() {
    for (let i = 0; i < loans.length; i++) {
        let payment = prompt(`Enter minimum payment for loan ${loans[i].id}`);
        minimumPayments.push(payment);
    }
    return minimumPayments;
}


//-----------------------------SnowBall Method Calculation-----------------------------------

// calculate the total monthly payment for the next 12 months
function calculateTotalMonthlyPayment(minimumPayments, additionalPayment) {
    // array of total monthly payment for each month
    let totalMonthlyPayments = []; 
    sumOfPrincipals();
    let tempPrincipal = totalPrincipal;
    for (let i = 0; i < 12; i++) {
        let totalMonthPayment = 0;
        for (let j = 0; j < loans.length; j++) {
            // Loan is the smallest amount -> use additional payment
            if (loans[j].id === smallestLoan.id) {
                // Smallest loan principal - smallest loan min payment + additional payment < 0 ==> Pay off the loan, apply the remaining amount to the next smallest loan
                if (loans[j].principal - minimumPayments[j] + additionalPayment < 0) {
                    let remainder = additionalPayment - loans[j].principal;
                    totalMonthPayment += minimumPayments[j] + additionalPayment;
                    tempPrincipal -= loans[j].principal + additionalPayment;  
                    loans[j].principal = 0;
                    // remove current smallest loan from the loans list and minimum payments list
                    loans.splice(j, 1);
                    minimumPayments.splice(j, 1);
                    // find the next smallest loan
                    findSmallestLoan(); 
                    // apply the remaining amount to the next smallest loan
                    loans[j].principal -= remainder;
                }
                // Smallest loan principal - smallest loan min payment + additional payment = 0
                else if (loans[j].principal - minimumPayments[j] + additionalPayment === 0) {
                    totalMonthPayment += loans[j].principal + additionalPayment;
                    tempPrincipal -= loans[j].principal + additionalPayment;
                    loans[j].principal = 0;
                    // remove current smallest loan from the loans list and minimum payments list
                    loans.splice(j, 1);
                    minimumPayments.splice(j, 1);
                    // find the next smallest loan
                    findSmallestLoan();
                } 
                // Smallest loan principal - smallest loan min payment + additional payment > 0
                else {
                    totalMonthPayment += minimumPayments[j] + additionalPayment;
                    tempPrincipal -= additionalPayment + minimumPayments[j];
                    loans[j].principal -= additionalPayment + minimumPayments[j];
                }  
            }
            // Loan is not the smallest amount
            else {
                totalMonthPayment += minimumPayments[j];
                tempPrincipal -= minimumPayments[j];
                loans[j].principal -= minimumPayments[j];
            }


            
        }
        totalMonthlyPayments.push(totalMonthPayment);
            
    } 
    return totalMonthlyPayments;
}
