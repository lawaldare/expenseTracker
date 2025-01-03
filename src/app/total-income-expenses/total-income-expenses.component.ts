import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "total-income-expenses",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./total-income-expenses.component.html",
  styleUrl: "./total-income-expenses.component.scss",
})
export class TotalIncomeExpensesComponent {
  private readonly transactionService = inject(TransactionService);
  public readonly totalIncome = this.transactionService.totalIncome;
  public readonly totalExpense = this.transactionService.totalExpense;
  public readonly selectedCurrencySymbol =
    this.transactionService.selectedCurrencySymbol;
}
