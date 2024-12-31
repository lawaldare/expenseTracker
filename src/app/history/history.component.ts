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

  public deleteTransaction(id): void {
    const transactions = this.transactions().filter(
      (transaction) => transaction.id !== id
    );
    this.transactionService.updateTransaction(transactions);
    localStorage.setItem("transactions", JSON.stringify(this.transactions()));
  }
}
