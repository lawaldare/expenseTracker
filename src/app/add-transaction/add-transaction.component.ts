import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Transaction } from "../transaction.model";
import { TransactionService } from "../transaction.service";
import { MaterialModule } from "../material.module";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "add-transaction",
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: "./add-transaction.component.html",
  styleUrl: "./add-transaction.component.scss",
})
export class AddTransactionComponent {
  private readonly transactionService = inject(TransactionService);
  public readonly transactions = this.transactionService.publicTransactions;
  public category = "-";
  public dialogRef = inject(MatDialogRef<AddTransactionComponent>);

  onSubmit(form: NgForm) {
    const transaction: Transaction = form.value;
    transaction.id = this.transactionService.generateID();
    transaction.timeStamp = new Date();
    this.transactionService.saveTransaction(transaction);
    // const updatedTransactions = [...this.transactions(), transaction];
    // this.transactionService.updateTransaction(updatedTransactions);
    form.resetForm();
  }
}
