import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketSchema = new Schema({
  code: {
    type: String,
    default: "AAA222",
    required: false
  },
  purchase_datetime: {
    type: Date,
    default: Date.now()
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});


ticketSchema.plugin(mongoosePaginate);
const ticketModel = model("Ticket", ticketSchema);

export { ticketModel };