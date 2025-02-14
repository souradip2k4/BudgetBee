## Route
GET /entries/:id

## Description
This route retrieves a specific entry from the database based on the provided `id` parameter.

## Request Parameters
- `id`: (Required) The unique identifier of the expense entry.

## Response
The response is a JSON object containing the following details about the expense entry (excluding sensitive user information):

- `amount`: The expense amount.
- `date`: The expense date (in JavaScript Date object format).
- `tags`: An array of objects representing the tags associated with the expense, including:
    - `id`: The unique identifier of the tag.
    - `name`: The name of the tag.
- `category`: An object representing the category of the expense, including:
    - `id`: The unique identifier of the category.
    - `name`: The name of the category.
    - `created_at`: The timestamp when the category was created (omitting related expenses and updated time).


## Example
### Request
```http
GET /entries/clvotprm9000008mhfzw477gc
```
### Response
```json
{
  "amount": 100.5,
  "date": "2024-05-02T11:14:00.000Z",
  "tags": [
    {
      "id":"clvots1np000208mhga6p46z5",
      "name": "Groceries"
    },
    {
      "id":"clvotrhsh000108mhej9b0cm",
      "name": "Essential"
    }
  ],
  "category": {
    "id": 3,
    "name": "Shopping",
    "created_at": "2024-04-20T09:30:00.000Z",
    "updated_at": "2024-04-20T09:30:00.000Z"
  }
}
```
