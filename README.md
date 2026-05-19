# Jamii Trust: Peer-to-Peer Escrow Infrastructure 🛡️

**Jamii Trust** is a secure, transaction-agnostic escrow engine designed to bridge the "Trust Deficit" in the digital and gig economy. It acts as a neutral digital vault that secures funds and only releases them when mutually agreed milestones are met.

This project was developed as a Final Year Project to demonstrate the technical enforcement of trust using robust financial logic and modern web technologies.

## Key Features

* **Secure Escrow Engine:** Funds are mathematically locked (`escrow_balance`) upon project initiation, assuring the seller that the money exists.
* **Atomic Transactions:** Built with Django's `transaction.atomic()` and PostgreSQL row-level locking (`select_for_update`) to absolutely prevent race conditions, double-spending, or data loss during money movement.
* **Milestone-Based Workflow:** Large contracts can be broken down into strict lifecycle stages (`PENDING` -> `FUNDED` -> `SUBMITTED` -> `PAID`).
* **Role-Agnostic Accounts:** Any user can act as a Buyer (Client) or Seller (Freelancer/Vendor) depending on the specific transaction.
* **Real-time Dashboard:** A responsive React frontend that accurately tracks available vs. locked balances.

##  Technology Stack

**Frontend:**
* React.js
* Tailwind CSS
* Context API for State Management

**Backend:**
* Python / Django 4.2
* Django REST Framework (DRF)
* Simple JWT (JSON Web Tokens for Authentication)

**Database:**
* PostgreSQL (Chosen for strict ACID compliance)

## System Architecture Highlight

The core innovation of this platform is the money-movement logic. To guarantee that funds never disappear during a server crash, all financial transfers use database-level locking:

```python
# Snippet from EscrowService
with transaction.atomic():
    buyer_wallet = Wallet.objects.select_for_update().get(user=project.buyer)
    seller_wallet = Wallet.objects.select_for_update().get(user=project.seller)
    
    # Financial transfer logic executes securely...
