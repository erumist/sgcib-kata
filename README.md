## Before

I remade my commit when I were done because I didn't like how I made it

## Spec

Bank account kata
Think of your personal bank account experience. When in doubt, go for the simplest solution

Requirements
Deposit and Withdrawal
Account statement (date, amount, balance)
Statement printing

User Stories
US 1:
In order to save money
As a bank client
I want to make a deposit in my account

US 2:
In order to retrieve some or all of my savings
As a bank client
I want to make a withdrawal from my account

US 3:
In order to check my operations
As a bank client
I want to see the history (operation, date, amount, balance)  of my operations

## Installation

npm install


## Running tests

npm test

## Running server

npm start


## WebService endpoint

POST (/users/transaction)
{transaction: {idUser: 'id', amount: 'number', type: 'TRANSACTION_TYPE'}}
return full user object

GET (/users/history) id
return full user object
