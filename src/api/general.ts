import { API_URL } from ".";

export const API_BASE = API_URL + "/api/v1.0.0";

// Location
export const LOCATION = API_BASE + "/location";
export const API_GET_COUNTRIES = LOCATION + "/countries"; // GET
export const API_GET_STATES = LOCATION + "/states"; // GET ?countryCode=AF (requires country code)
export const API_GET_CITIES = LOCATION + "/cities"; // GET ?countryCode=US&stateCode=CA (requires state and country code)
export const API_GET_CITIES_BY_COUNTRIES = LOCATION + "/states-by-countries"; // GET ?countryCodes=

// File
export const FILE = API_BASE + "/files";
export const API_UPLOAD_FILE = FILE; // POST
export const API_GET_FILE = FILE + "/"; // GET
export const API_DELETE_FILE = FILE + "/"; // DELETE

// Chats
export const CHATS = API_BASE + "/chats";
export const API_START_CHAT = CHATS; // POST: create chat => initiatorId,participantId,initiatorType,participantType,messageText,senderUserId
export const API_GET_USER_CHATS = CHATS + "?id="; // GET: + id
export const API_SEND_MESSAGE = CHATS + "/send-message"; // POST => chatId,senderId,recipientId,text,senderUserId
export const API_GET_CHAT_BY_USER = CHATS; // GET + /{chatId}/user/{userId}
export const API_GET_CHAT_MESSAGES = CHATS + "/messages"; // GET
export const API_EDIT_MESSAGE = CHATS + "/messages"; // PATCH => chatId,messageId,text,status
export const API_PIN_CHAT = CHATS + "/pin-order"; // PATCH => isPinned, pinOrder, chatId, userId
export const API_MARK_MESSAGES_AS_SEEN = CHATS + "/messages/mark-as-seen"; // PATCH chatId:string ,messageIds:[]
export const API_DELETE_CHAT = `${CHATS}/`; // DELETE + id