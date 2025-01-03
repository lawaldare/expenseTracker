import { computed, Injectable, signal } from "@angular/core";
import { Transaction } from "./transaction";

export interface Currency {
  name: string;
  symbol: string;
  rate?: number;
  type: CurrencyType;
  label: string;
}

export type CurrencyType =
  | "PoundSterling"
  | "Euro"
  | "UnitedStatesDollars"
  | "CanadaDollars";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private transactions = signal<Transaction[]>([]);
  public publicTransactions = this.transactions.asReadonly();

  public readonly currencyConfig = {
    CAD: 1.8,
    EUR: 1.21,
    GBP: 1,
    USD: 1.25,
  };

  public readonly currencies: Currency[] = [
    {
      name: "Pound Sterling",
      symbol: "£",
      type: "PoundSterling",
      label: "GBP",
    },
    {
      name: "Euro",
      symbol: "€",
      type: "Euro",
      label: "EUR",
    },
    {
      name: "United States Dollars",
      symbol: "$",
      type: "UnitedStatesDollars",
      label: "USD",
    },
    {
      name: "Canada Dollars",
      symbol: "CAD $",
      type: "CanadaDollars",
      label: "CAD",
    },
  ];

  public selectedCurrency = signal<CurrencyType>(this.currencies[0].type);

  public selectedCurrencySymbol = computed(() => {
    const currency = this.currencies.find(
      (curr) => curr.type === this.selectedCurrency()
    );
    return currency.symbol;
  });

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
