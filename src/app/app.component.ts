import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { TotalIncomeExpensesComponent } from "./total-income-expenses/total-income-expenses.component";
import { HistoryComponent } from "./history/history.component";
import { TransactionService } from "./transaction.service";
import { AddTransactionComponent } from "./add-transaction/add-transaction.component";

@Component({
  selector: "app-root",
  imports: [
    CommonModule,
    TotalIncomeExpensesComponent,
    HistoryComponent,
    AddTransactionComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
})
export class AppComponent {
  private readonly transactionService = inject(TransactionService);
  public readonly transactions = this.transactionService.publicTransactions;
  public totalBalance = this.transactionService.totalBalance;
}
