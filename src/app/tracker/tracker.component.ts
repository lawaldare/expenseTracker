import { AuthService } from "./../auth.service";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import html2pdf from "html2pdf.js";
import { AddTransactionComponent } from "../add-transaction/add-transaction.component";
import { HistoryComponent } from "../history/history.component";
import { TotalIncomeExpensesComponent } from "../total-income-expenses/total-income-expenses.component";
import { TransactionService, CurrencyType } from "../transaction.service";
import { Router } from "@angular/router";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
export class TrackerComponent implements OnInit {
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

  async ngOnInit(): Promise<void> {
    const userId = await this.authService.getUserId();
    this.transactionService.getTransactions(userId);
  }

  public changeCurrency(currencyType: CurrencyType): void {
    this.transactionService.setPreviousCurrency(
      this.transactionService.currentCurrencyLabel()
    );
    const curr = this.currencies.find((curr) => curr.type === currencyType);
    this.transactionService.updateSelectedCurrency(curr);
    this.transactionService.updateCurrencies();
  }

  public deleteAllTransaction(): void {
    const response = confirm(
      "Are you sure you want to delete all transactions?"
    );
    if (response) {
      this.transactionService.deleteAllTransactions();
    }
  }

  public exportAsPDF(): void {
    // const element: any = document.getElementById("htmlData");
    // html2pdf(element);
    let DATA: any = document.getElementById("htmlData");
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL("image/png");
      let PDF = new jsPDF("p", "mm", "a4");
      let position = 0;
      PDF.addImage(FILEURI, "PNG", 0, position, fileWidth, fileHeight);
      PDF.save("receipt.pdf");
    });
  }

  public async logout(): Promise<void> {
    await this.authService.logoutUser();
    this.router.navigate(["/"]);
  }
}
