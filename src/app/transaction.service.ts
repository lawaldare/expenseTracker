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

  private previousCurrency = signal<string>("");
  public publicPreviousCurrency = this.previousCurrency.asReadonly();

  public currentCurrency = signal<string>("GBP");

  public readonly currencyConfig = {
    GBPCAD: 1.7943656746,
    GBPEUR: 1.2045411764,
    GBPUSD: 1.2421277739,
    EURCAD: 1.4896673602,
    EURGBP: 0.8301916278,
    EURUSD: 1.0312040786,
    CADEUR: 0.671290804,
    CADGBP: 0.5573000053,
    CADUSD: 0.692237815,
    USDCAD: 1.4445902525,
    USDEUR: 0.9697401521,
    USDGBP: 0.8050701554,
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

  public updateCurrencies(): void {
    const exchangeCurrencies = `${this.previousCurrency()}${this.currentCurrency()}`;
    const rate = this.currencyConfig[exchangeCurrencies];
    const updatedTransactions = this.transactions().map((transaction) => {
      return {
        ...transaction,
        amount: transaction.amount * rate,
      };
    });
    this.updateTransaction(updatedTransactions);
  }

  public updateTransaction(trans: Transaction[]) {
    this.transactions.set(trans);
  }

  public setPreviousCurrency(str: string): void {
    this.previousCurrency.set(str);
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
