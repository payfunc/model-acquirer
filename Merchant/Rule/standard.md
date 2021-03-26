# Standard Rules
Check tests to see if they are implemented correctly.
## Authorization Rules
Standard 3d Rule:

`reject authorization if authorization.amount>15 & !authorization.verification:verified & !authorization.recurring:subsequent`

Force 3d on Initial Recurring:

`reject authorization if authorization.recurring:initial & !authorization.verification:verified`

Force descriptor:

`reject authorization if !authorization.descriptor: (*merchant.descriptor* | *merchant.name*)`

Force CsC for not recurring authorizations:

`reject authorization if !authorization.recurring:subsequent & !authorization.card.csc:present`

Enforce Schemes set in the merchant:

`reject authorization if !authorization.card.scheme:some(merchant.scheme)`
## Capture Rules
Reject captures that exceed the authorized amount by more than 5 percent:

`reject capture if amount>(authorization.amount*1.05 - authorization.captured.amount)`
## Refund Rules
Reject refunds that exceed the refundable amount:

`reject refund if merchant.refundable<0`

