import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Transaction } from "../transaction";
import { TransactionService } from "../transaction.service";

@Component({
  selector: "add-transaction",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./add-transaction.component.html",
  styleUrl: "./add-transaction.component.scss",
})
export class AddTransactionComponent {
  private readonly transactionService = inject(TransactionService);
  public readonly transactions = this.transactionService.publicTransactions;

  onSubmit(form: NgForm) {
    const transaction: Transaction = form.value;
    transaction.id = this.transactionService.generateID();
    const updatedTransactions = [...this.transactions(), transaction];
    this.transactionService.updateTransaction(updatedTransactions);
    form.resetForm();
    localStorage.setItem("transactions", JSON.stringify(this.transactions()));
  }
}
