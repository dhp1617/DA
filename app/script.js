document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("mic-btn").addEventListener("click", startVoiceRecognition);

async function sendMessage() {
    let inputField = document.getElementById("user-input");
    let message = inputField.value;
    inputField.value = "";

    let chatbox = document.getElementById("chat-box");
    chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

    let response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    });

    let data = await response.json();
    chatbox.innerHTML += `<p><strong>Jarvis:</strong> ${data.response}</p>`;
}

// Voice input
function startVoiceRecognition() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();

    recognition.onresult = async function(event) {
        let message = event.results[0][0].transcript;
        document.getElementById("user-input").value = message;
        sendMessage();
    };
}

// Floating particles
let canvas = document.getElementById("particles");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 50; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();
