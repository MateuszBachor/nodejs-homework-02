  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;


const contact = new Schema(
{
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        unique: true,
        minlength:7
    },
    phone: {
        type: String,
         minlength: 9,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
      owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
    }
)
const Contact = mongoose.model("contacts", contact);

module.exports = Contact;