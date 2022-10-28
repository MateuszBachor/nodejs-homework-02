const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.error("Load error", error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await fs.readFile(contactsPath);
    const jsonContacts = await JSON.parse(contacts);
    return jsonContacts.filter((contact) => contact.id === contactId.toString());
  } catch (error) {
    console.error("Get contact error", error.message);
  }
};


const removeContact = async (contactId) => {
  try {
    const contacts = await fs.readFile(contactsPath);    
    const jsonContacts = await JSON.parse(contacts);
    const contact = jsonContacts.filter((contact) => contact.id === contactId.toString());
    const removedContact = await jsonContacts.filter((contact) => contact.id !== contactId.toString());
    await fs.writeFile(contactsPath, JSON.stringify(removedContact));
    return contact;
  } catch (error) {
    console.error( error.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await fs.readFile(contactsPath);
    const jsonContacts = await JSON.parse(contacts);
    const newContact = {...body, id:(jsonContacts.length +1).toString()};
    const newContacts = [...jsonContacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return newContact;
  } catch (error) {
    console.error( error.message);
  }
}

const updateContact = async (contactId, body) => {
  try {
    const contacts = await fs.readFile(contactsPath);
    const jsonContacts = await JSON.parse(contacts);
    let newArray = jsonContacts.filter((contact) => contact.id !== contactId.toString());
    const newContact = { ...body, id: contactId };
    newArray = [...newArray, newContact]
    await fs.writeFile(contactsPath, JSON.stringify(newArray));
    return newContact;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { 
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
