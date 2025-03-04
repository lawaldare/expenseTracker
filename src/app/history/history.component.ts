import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TransactionService } from "../transaction.service";
import { MatDialog } from "@angular/material/dialog";
import { MaterialModule } from "../material.module";
import { AddTransactionComponent } from "../add-transaction/add-transaction.component";

@Component({
  selector: "history",
  imports: [CommonModule, MaterialModule, AddTransactionComponent],
  standalone: true,
  templateUrl: "./history.component.html",
  styleUrl: "./history.component.scss",
})
export class HistoryComponent {
  private readonly transactionService = inject(TransactionService);
  public readonly transactions = this.transactionService.publicTransactions;
  public readonly selectedCurrencySymbol =
    this.transactionService.selectedCurrencySymbol;
  private readonly dialog = inject(MatDialog);
  public deleteTransaction(transaction): void {
    const response = confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (response) {
      this.transactionService.deleteTransaction(transaction);
    }
  }

  openAddTransactionDialog() {
    this.dialog.open(AddTransactionComponent, {
      disableClose: false,
      panelClass: "add-transaction-dialog",
    });
  }
}
