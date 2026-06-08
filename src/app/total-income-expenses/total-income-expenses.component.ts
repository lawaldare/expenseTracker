import { CommonModule } from "@angular/common";
import {
  Component,
  inject,
  input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "total-income-expenses",
  imports: [CommonModule],
  templateUrl: "./total-income-expenses.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./total-income-expenses.component.scss",
})
export class TotalIncomeExpensesComponent {
  private readonly transactionService = inject(TransactionService);
  public readonly totalIncome = this.transactionService.totalIncome;
  public readonly totalExpenses = this.transactionService.totalExpenses;
  public readonly totalBills = this.transactionService.totalBills;
  public readonly totalInvestments = this.transactionService.totalInvestments;

  public readonly selectedCurrencySymbol =
    this.transactionService.selectedCurrencySymbol;
}
