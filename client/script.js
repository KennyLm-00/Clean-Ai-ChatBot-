// Importing images for the chat interface
import bot from './assets/bot.svg';
import bot2 from './assets/icons8-robot-3d-fluency-32.png';
import boom from './assets/boom.svg';
import happyrobot2 from './assets/happyrobot2.svg';
import user from './assets/person.png';

// Getting references to the form and chat container in the HTML
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

// Function to display loading dots
function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

// Function to type out text in the chat
function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

// Function to generate a unique ID for a chat message
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

// Function to create a chat message HTML element
function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot2 : user}" alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `;
}

// Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // Display user's message in chat
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // Display bot's message in chat
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  // Display loading dots
  loader(messageDiv);

  // Send user's message to the server and get bot's response
  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    // Display bot's response in chat
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    // Display an error message in case of an error
    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

// Add event listeners for form submission (on submit) and enter key press (on keyup)
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})
