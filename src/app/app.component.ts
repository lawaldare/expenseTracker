import { Transaction } from './transaction';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'expense-tracker';

  transactions: Transaction[] = [];
  totalIncome: number;
  totalExpense: number;
  totalBalance: number


  localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
  );

  ngOnInit() {
    this.transactions = localStorage.getItem('transactions') !== null ? this.localStorageTransactions : [];
    this.updateData();
  }

  onSubmit(form: NgForm) {
    const transaction: Transaction = form.value;
    transaction.id = this.generateID();
    this.transactions.push(transaction);
    form.resetForm();
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
    this.transactions = JSON.parse(localStorage.getItem('transactions')) !== null ? this.transactions : [];
    this.updateData();
  }

  getTotalIncome() {
    const incomeArray = this.transactions.filter(a => a.category === '+'
    )
    this.totalIncome = incomeArray.reduce((a, b) => (a + b.amount), 0);
  }

  getTotalExpense() {
    const expenseArray = this.transactions.filter(a => a.category === '-'
    )
    this.totalExpense = expenseArray.reduce((a, b) => (a + b.amount), 0);
  }

  getTotalBalance() {
    this.totalBalance = this.totalIncome - this.totalExpense;
  }


  generateID() {
    return Math.floor(Math.random() * 100000000);
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
    this.updateData();

  }

  updateData() {
    this.getTotalIncome();
    this.getTotalExpense();
    this.getTotalBalance();
  }
}


