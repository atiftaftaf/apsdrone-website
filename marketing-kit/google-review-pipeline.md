# APS Drone Google Review Pipeline

Review link: https://g.page/r/CbNNLDqa9yVeEBI/review

## Trigger

Start the request only after a real project is complete and the client has confirmed that the delivery link works. Resolve any open delivery or service concern before asking for feedback.

## Fail-closed eligibility gate

A completed flight, finished edit, payment or locally available file does not by itself prove that the customer received the deliverables. Before sending a request, the tracker must contain one of these delivery signals:

- the customer's written confirmation that the delivery link opens;
- an owner-recorded delivery confirmation based on the actual sent message and accessible delivery link; or
- another project record that directly proves the agreed deliverables were successfully delivered.

If no direct delivery evidence exists, record `HOLD_DELIVERY_UNVERIFIED` and send nothing. Do not infer delivery from a scheduled shoot, payment, local export, draft email, text conversation or public case study. Change the status to `ELIGIBLE_DELIVERY_CONFIRMED` only when the evidence exists, then follow the neutral workflow below.

Recommended tracker states: `HOLD_DELIVERY_UNVERIFIED`, `ELIGIBLE_DELIVERY_CONFIRMED`, `REQUEST_SENT`, `FOLLOW_UP_SENT`, `REVIEW_RECEIVED` and `CLOSED_NO_REVIEW`.

## Workflow

1. Record the completed project and its eligibility state in `google-review-tracker.csv` without customer names, email addresses, phone numbers, exact addresses or confidential scope.
2. Send the approved SMS or email template within 24 hours of delivery confirmation.
3. Mark the request date and channel.
4. If there is no response, send one polite follow-up after 5–7 days.
5. Stop after the follow-up. Do not repeatedly contact the customer.
6. When a review appears, record the public review date and respond from the Google Business Profile in a concise, project-relevant way without disclosing private details.

## Fair-review rules

- Request an honest review from every genuine completed customer using the same neutral process.
- Never offer a discount, gift, payment or other incentive for a review.
- Never ask only customers expected to leave positive reviews.
- Never provide suggested star ratings or prewritten praise.
- Do not publish a customer's name, address, project location or confidential scope in a response unless it is already public and appropriate.

## Suggested owner rhythm

- Monday: check completed projects from the prior week.
- Tuesday: send first requests for eligible projects.
- Following Monday: send the single follow-up where appropriate.
- Monthly: compare requests sent, reviews received and response rate; do not optimize by filtering customers.
