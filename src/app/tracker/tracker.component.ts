import { AuthService } from "./../auth.service";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import html2pdf from "html2pdf.js";
import { AddTransactionComponent } from "../add-transaction/add-transaction.component";
import { HistoryComponent } from "../history/history.component";
import { TotalIncomeExpensesComponent } from "../total-income-expenses/total-income-expenses.component";
import { TransactionService, CurrencyType } from "../transaction.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-tracker",
  imports: [
    CommonModule,
    TotalIncomeExpensesComponent,
    HistoryComponent,
    AddTransactionComponent,
    FormsModule,
  ],
  templateUrl: "./tracker.component.html",
  styleUrls: ["./tracker.component.scss"],
  standalone: true,
})
export class TrackerComponent {
  private readonly transactionService = inject(TransactionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly transactions = this.transactionService.publicTransactions;
  public readonly totalBalance = this.transactionService.totalBalance;
  public readonly currencies = this.transactionService.currencies;
  public readonly user = this.authService.publicUser;
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

  public async logout(): Promise<void> {
    await this.authService.logoutUser();
    this.router.navigate(["/"]);
  }
}
