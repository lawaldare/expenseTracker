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

  private selectedCurrency = signal<Currency>({} as Currency);
  public publicSelectedCurrency = this.selectedCurrency.asReadonly();

  private previousCurrencyLabel = signal<string>("");
  public publicPreviousCurrencyLabel = this.previousCurrencyLabel.asReadonly();

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

  public selectedCurrencyType = computed(() => {
    const c = this.selectedCurrency();
    return c.type;
  });
  public currentCurrencyLabel = computed(() => {
    const c = this.selectedCurrency();
    return c.label;
  });

  public selectedCurrencySymbol = computed(() => {
    const currency = this.currencies.find(
      (curr) => curr.type === this.selectedCurrencyType()
    );
    return currency.symbol;
  });

  constructor() {
    if (localStorage["transactions"]) {
      const transactions = JSON.parse(localStorage.getItem("transactions"));
      this.updateTransaction(transactions);
    }

    if (localStorage["currency"]) {
      const currency = JSON.parse(localStorage.getItem("currency"));
      this.updateSelectedCurrency(currency);
    } else {
      this.updateSelectedCurrency(this.currencies[0]);
    }
  }

  public updateCurrencies(): void {
    const exchangeCurrencies = `${this.previousCurrencyLabel()}${this.currentCurrencyLabel()}`;
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
    localStorage.setItem("transactions", JSON.stringify(this.transactions()));
  }

  public updateSelectedCurrency(currency: Currency): void {
    this.selectedCurrency.set(currency);
    localStorage.setItem("currency", JSON.stringify(this.selectedCurrency()));
  }

  public setPreviousCurrency(str: string): void {
    this.previousCurrencyLabel.set(str);
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
