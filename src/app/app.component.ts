import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TotalIncomeExpensesComponent } from "./total-income-expenses/total-income-expenses.component";
import { HistoryComponent } from "./history/history.component";
import { CurrencyType, TransactionService } from "./transaction.service";
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
  public selectedCurrencyType = this.transactionService.selectedCurrencyType();
  public selectedCurrencySymbol =
    this.transactionService.selectedCurrencySymbol;

  public changeCurrency(currencyType: CurrencyType): void {
    this.transactionService.setPreviousCurrency(
      this.transactionService.currentCurrencyLabel()
    );
    const curr = this.currencies.find((curr) => curr.type === currencyType);
    this.transactionService.updateSelectedCurrency(curr);
    this.transactionService.updateCurrencies();
  }

  public deleteAllTransaction(): void {
    this.transactionService.updateTransaction([]);
  }

  public exportAsPDF(): void {
    const element: any = document.getElementById("htmlData");
    html2pdf(element);
  }
}
