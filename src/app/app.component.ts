import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TotalIncomeExpensesComponent } from "./total-income-expenses/total-income-expenses.component";
import { HistoryComponent } from "./history/history.component";
import { TransactionService } from "./transaction.service";
import { AddTransactionComponent } from "./add-transaction/add-transaction.component";
import { FormsModule } from "@angular/forms";
import html2pdf from "html2pdf.js";

@Component({
  selector: "app-root",
  imports: [
    CommonModule,
    TotalIncomeExpensesComponent,
    HistoryComponent,
    AddTransactionComponent,
    FormsModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
})
export class AppComponent {
  private readonly transactionService = inject(TransactionService);
  public readonly transactions = this.transactionService.publicTransactions;
  public totalBalance = this.transactionService.totalBalance;
  public readonly currencies = this.transactionService.currencies;
  public selectedCurrency = this.transactionService.selectedCurrency;
  public selectedCurrencySymbol =
    this.transactionService.selectedCurrencySymbol;

  changeCurrency(currency) {
    // console.log(currency);
    // const curr = this.currencies.find((curr) => curr.type === currency);
    // const updatedTransactions = this.transactions().map((transaction) => ({
    //   ...transaction,
    //   amount:
    //     transaction.amount *
    //     (1 / this.transactionService.currencyConfig[curr.label]),
    // }));
    // this.transactionService.updateTransaction(updatedTransactions);
  }

  public deleteAllTransaction(): void {
    this.transactionService.updateTransaction([]);
  }

  public exportAsPDF(): void {
    const element: any = document.getElementById("htmlData");
    html2pdf(element);
  }
}
