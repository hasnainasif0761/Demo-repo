let currentCall = null;
let timerInterval = null;
let seconds = 0;

// Generate a short custom ID like "user_45678"
const shortId = 'user_' + Math.floor(Math.random() * 100000);

// Create PeerJS connection with custom ID
const peer = new Peer(shortId);

peer.on('open', (id) => {
  document.getElementById('my-id').textContent = id;
});

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    document.getElementById("call-timer").textContent = `${hrs}:${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  document.getElementById("call-timer").textContent = "00:00:00";
}

// Receive incoming call
peer.on('call', (call) => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      call.answer(stream);
      currentCall = call;

      call.on('stream', remoteStream => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
        startTimer();
      });

      call.on('close', () => {
        stopTimer();
        alert("Call ended.");
      });
    });
});

// Make outgoing call
document.getElementById('callBtn').addEventListener('click', () => {
  const friendId = document.getElementById('friend-id').value;
  if (!friendId) return alert("Enter a friend's ID");

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      const call = peer.call(friendId, stream);
      currentCall = call;

      call.on('stream', remoteStream => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
        startTimer();
      });

      call.on('close', () => {
        stopTimer();
        alert("Call ended.");
      });
    });
});

// End call manually
document.getElementById('endCallBtn').addEventListener('click', () => {
  if (currentCall) {
    currentCall.close();
    stopTimer();
    currentCall = null;
    alert("You ended the call.");
  } else {
    alert("No active call to end.");
  }
});
