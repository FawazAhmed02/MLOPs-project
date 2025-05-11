// Display the user message on the chat
function displayUserMessage(message) {
  let chat = document.getElementById("chat");
  let userMessage = document.createElement("div");
  userMessage.classList.add("message", "user");
  
  // Add animation delay for staggered effect
  userMessage.style.animationDelay = "0.1s";

  let userAvatar = document.createElement("div");
  userAvatar.classList.add("avatar");
  userAvatar.innerHTML = '<i class="fas fa-user"></i>';

  let userText = document.createElement("div");
  userText.classList.add("text");
  userText.innerHTML = message;

  userMessage.appendChild(userAvatar);
  userMessage.appendChild(userText);
  chat.appendChild(userMessage);
  chat.scrollTop = chat.scrollHeight;
}

// Display the bot message on the chat
function displayBotMessage(message) {
  let chat = document.getElementById("chat");
  let botMessage = document.createElement("div");
  botMessage.classList.add("message", "bot");
  
  // Add animation delay for staggered effect
  botMessage.style.animationDelay = "0.1s";

  let botAvatar = document.createElement("div");
  botAvatar.classList.add("avatar");
  botAvatar.innerHTML = '<i class="fas fa-robot"></i>';

  let botText = document.createElement("div");
  botText.classList.add("text");
  botText.innerHTML = message;

  botMessage.appendChild(botAvatar);
  botMessage.appendChild(botText);
  chat.appendChild(botMessage);
  chat.scrollTop = chat.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
  document.getElementById("typing-indicator").style.display = "inline-block";
}

// Hide typing indicator
function hideTypingIndicator() {
  document.getElementById("typing-indicator").style.display = "none";
}

// Send message to backend and get response
async function sendMessage() {
  const inputElem = document.getElementById("input");
  const userInput = inputElem.value.trim();
  if (!userInput) return;

  // Add button click animation
  const button = document.getElementById("button");
  button.classList.add("clicked");
  setTimeout(() => {
    button.classList.remove("clicked");
  }, 300);

  // Display user message
  displayUserMessage(userInput);
  inputElem.value = "";
  
  // Show typing indicator
  showTypingIndicator();
  
  try {
    // Replace with your actual backend URL
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: userInput })
    });

    // Hide typing indicator
    hideTypingIndicator();
    
    const data = await response.json();
    const botReply = data.response || "Sorry, I couldn't process your request at the moment.";
    displayBotMessage(botReply);
  } catch (error) {
    console.error("Error:", error);
    hideTypingIndicator();
    
    // For demo purposes, add some sample responses if backend is not available
    const demoResponses = [
      "I'm having trouble connecting to the server. Please check your connection and try again.",
      "Our banking knowledge base is currently updating. Please try again in a moment.",
      "I couldn't process your request. Let me know if you'd like to try a different question.",
      "It seems our servers are busy. Please try again shortly."
    ];
    
    const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
    displayBotMessage(`⚠️ ${randomResponse}`);
  }
}

// Add a click event listener to the button
document.getElementById("button").addEventListener("click", sendMessage);

// Add a keypress event listener to the input
document.getElementById("input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Add input focus animation
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('input');
  
  // Focus the input field when the page loads
  setTimeout(() => {
    input.focus();
  }, 1000);
  
  // Add ripple effect to button
  const button = document.getElementById('button');
  button.addEventListener('mousedown', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    
    const x = e.clientX - e.target.getBoundingClientRect().left;
    const y = e.clientY - e.target.getBoundingClientRect().top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});