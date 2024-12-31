import { computed, Injectable, signal } from "@angular/core";
import { Transaction } from "./transaction";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private transactions = signal<Transaction[]>([]);
  public publicTransactions = this.transactions.asReadonly();

  constructor() {
    if (localStorage["transactions"]) {
      const transactions = JSON.parse(localStorage.getItem("transactions"));
      this.updateTransaction(transactions);
    }
  }

  public updateTransaction(trans: Transaction[]) {
    this.transactions.set(trans);
  }

  public generateID(): number {
    return Math.floor(Math.random() * 100000000);
  }

  public totalIncome = computed(() => {
    const incomeArray = this.transactions().filter((a) => a.category === "+");
    return incomeArray.reduce((a, b) => a + b.amount, 0);
  });
  public totalExpense = computed(() => {
    const expenseArray = this.transactions().filter((a) => a.category === "-");
    return expenseArray.reduce((a, b) => a + b.amount, 0);
  });
  public totalBalance = computed(
    () => this.totalIncome() - this.totalExpense()
  );
}
