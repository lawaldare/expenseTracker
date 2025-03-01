import { computed, inject, Injectable, signal } from "@angular/core";
import { Transaction, User } from "./transaction.model";
import { HttpClient } from "@angular/common/http";
import { ID, Models, Query } from "appwrite";
import { database } from "src/appwriteConfig";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { HotToastService } from "@ngxpert/hot-toast";

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
  | "CanadaDollars"
  | "Naira";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly toast = inject(HotToastService);

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
    GBPNGN: 1928.0315,
    EURCAD: 1.4896673602,
    EURGBP: 0.8301916278,
    EURUSD: 1.0312040786,
    EURNGN: 1602.8195,
    CADEUR: 0.671290804,
    CADGBP: 0.5573000053,
    CADUSD: 0.692237815,
    CADNGN: 1073.6956,
    USDCAD: 1.4445902525,
    USDEUR: 0.9697401521,
    USDGBP: 0.8050701554,
    USDNGN: 1535.2875,
    NGNGBP: 0.00051867,
    NGNUSD: 0.00065027,
    NGNEUR: 0.0006239,
    NGNCAD: 0.00093136,
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
    // {
    //   name: "Naira",
    //   symbol: "₦",
    //   type: "Naira",
    //   label: "NGN",
    // },
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
    // if (localStorage["transactions"]) {
    //   const transactions = JSON.parse(localStorage.getItem("transactions"));
    //   this.updateTransaction(transactions);
    // }

    if (localStorage["currency"]) {
      const currency = JSON.parse(localStorage.getItem("currency"));
      this.updateSelectedCurrency(currency);
    } else {
      this.updateSelectedCurrency(this.currencies[0]);
    }

    // this.http
    //   .get(
    //     `${environment.API}pair/${this.previousCurrencyLabel}/${this.currentCurrencyLabel}`
    //   )
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
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

  public updateTransaction(trans: any[]) {
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

  public generateID(): string {
    return ID.unique(15);
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

  public async saveTransaction(transaction: Transaction) {
    try {
      const documentId = this.generateID();
      const session = this.authService.getSession();
      const userId = session.userId
        ? session.userId
        : session["targets"][0].userId;
      // console.log(session["targets"][0].userid);
      await database.createDocument(
        environment.databaseId,
        environment.transactionCollectionId,
        documentId,
        {
          userId,
          text: transaction.text,
          timeStamp: transaction.timeStamp,
          category: transaction.category,
          id: transaction.id,
          amount: transaction.amount,
        }
      );
      this.getTransactions(userId);
    } catch (error) {
      console.error(error);
      this.toast.error("Error Occurred, please try again later!");
    }
  }

  public async getTransactions(userId: string) {
    try {
      const list = await database.listDocuments(
        environment.databaseId,
        environment.transactionCollectionId,
        [Query.equal("userId", userId)]
      );
      const data = list.documents;
      this.updateTransaction(data);
    } catch (error) {
      console.error(error);
      this.toast.error("Error Occurred, please try again later!");
    }
  }

  public async deleteTransaction(transaction: any) {
    try {
      const response = await database.deleteDocument(
        environment.databaseId,
        environment.transactionCollectionId,
        transaction.$id
      );

      this.getTransactions(transaction.userId);
      this.toast.success("Transaction deleted successfully");

      // this.updateTransaction(data);
      console.log(response);
    } catch (error) {
      this.toast.error("Error Occurred, please try again later!");
      console.error(error);
    }
  }
}
