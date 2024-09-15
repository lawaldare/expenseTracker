import { Transaction } from "./transaction";
import { Component, computed, OnInit, signal } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public transactions = signal<Transaction[]>([]);
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

  ngOnInit() {
    if (localStorage["transactions"]) {
      const transactions = JSON.parse(localStorage.getItem("transactions"));
      this.transactions.set(transactions);
    }
  }

  onSubmit(form: NgForm) {
    const transaction: Transaction = form.value;
    transaction.id = this.generateID();
    this.transactions.update(() => [...this.transactions(), transaction]);
    form.resetForm();
    localStorage.setItem("transactions", JSON.stringify(this.transactions()));
    this.transactions.set(
      JSON.parse(localStorage.getItem("transactions")) !== null
        ? this.transactions()
        : []
    );
  }

  private generateID(): number {
    return Math.floor(Math.random() * 100000000);
  }

  public deleteTransaction(id): void {
    const transactions = this.transactions().filter(
      (transaction) => transaction.id !== id
    );
    this.transactions.set(transactions);
    localStorage.setItem("transactions", JSON.stringify(this.transactions()));
  }
}
