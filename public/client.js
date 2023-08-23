// Connect to the Socket.io server
const socket = io();

let username;

// Dictionary mapping words to emojis
const emojiDictionary = {
  react: "⚛️",
  woah: "😮",
  hey: "👋🏼",
  lol: "😂",
  like: "❤️",
  congratulations: "🎉"
};

// Dictionary mapping slash commands to functions and descriptions
const slashCommands = {
  '/help': {
    description: 'Show this message',
    action: () => {
      const helpMessage = Object.entries(slashCommands)
        .map(([command, { description }], index) => `${index + 1}. ${command}: ${description}`)
        .join('\n');
      alert(helpMessage);
    }
  },
  '/random': {
    description: 'Print a random number',
    action: () => {
      const randomNumber = Math.floor(Math.random() * 100);
      const randomMessage = `Your random number is ${randomNumber}`;
      const messageElement = document.createElement('div');
      messageElement.textContent = randomMessage;
      messages.appendChild(messageElement);
    }
  },
  '/clear': {
    description: 'Clear the chat',
    action: () => {
      messages.innerHTML = '';
    }
  }
};


// Prompt when a user enters
do {
  username = prompt("You'd liked to be called?");
} while(!username);

socket.emit("user joined", username)

socket.on("update userlist", (users) => {
  const contactsList = document.querySelector(".contact-list");
  contactsList.innerHTML = "";

  users.forEach((user) => {
    const contactItem = document.createElement("li");
    contactItem.className = "contact";

    const contactNameSpan = document.createElement("span");
    contactNameSpan.className = "contact-name";
    contactNameSpan.textContent = user;

    contactItem.appendChild(contactNameSpan);
    contactsList.appendChild(contactItem);
  });
});

// Get references to the input elements and messages container
const sendMessageButton = document.getElementById('send-message-button');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');

// Add event listener for sending messages
sendMessageButton.addEventListener('click', sendMessage);

// Add event listener for Enter key press in the message input
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to send the message
function sendMessage() {
  const message = messageInput.value;
  if (message.trim() !== '') {
      if (message.startsWith('/')) {
          const command = message.split(' ')[0];
          const commandHandler = slashCommands[command];
          if (commandHandler) {
              commandHandler.action();
          }
      } else {
          const messageWithEmojis = replaceWordsWithEmojis(message);
          // Emit the 'chatMessage' event to the server
          socket.emit('chatMessage', messageWithEmojis);
      }
      messageInput.value = ''; // Clear the input field
  }
}

// Listen for the 'chatMessage' event from the server
socket.on('chatMessage', (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
});

// Function to replace emoji with its respective key
function replaceWordsWithEmojis(message) {
  // Split the message into words
  const words = message.split(' ');
  // Replace words with emojis
  const messageWithEmojis = words
        .map(word => {
            // Extract the word and any punctuation
            const matches = word.match(/^([^A-Za-z]*)([A-Za-z]+)([^A-Za-z]*)$/);
            if (matches) {
                const [, leadingPunctuation, matchedWord, trailingPunctuation] = matches;
                const emoji = emojiDictionary[matchedWord.toLowerCase()];
                if (emoji) {
                    const combinedPunctuation = leadingPunctuation + (trailingPunctuation ? emoji + trailingPunctuation : emoji);
                    return combinedPunctuation;
                }
            }
            return word;
        })
        .join(' ');
  return messageWithEmojis;
}
