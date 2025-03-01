import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "history",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./history.component.html",
  styleUrl: "./history.component.scss",
})
export class HistoryComponent {
  private readonly transactionService = inject(TransactionService);
  public readonly transactions = this.transactionService.publicTransactions;
  public readonly selectedCurrencySymbol =
    this.transactionService.selectedCurrencySymbol;

  public deleteTransaction(transaction): void {
    const response = confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (response) {
      this.transactionService.deleteTransaction(transaction);
    }
  }
}
