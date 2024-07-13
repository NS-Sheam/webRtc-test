const socket = io();
let localStream;
let peerConnection;
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // STUN server
};
console.log("helo");

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    const localVideo = document.getElementById("local-video");
    localVideo.srcObject = stream;
    localStream = stream;

    // Set up socket event listeners
    socket.on("offer", (data) => {
      createPeerConnection();
      peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      peerConnection.createAnswer().then((answer) => {
        peerConnection.setLocalDescription(answer);
        socket.emit("answer", { answer: answer });
      });
    });

    socket.on("answer", (data) => {
      peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    });

    socket.on("ice-candidate", (data) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
  })
  .catch((error) => {
    console.warn(error.message);
  });

function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);

  // Add local stream tracks to the peer connection
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle remote stream
  peerConnection.ontrack = (event) => {
    const remoteVideo = document.getElementById("remote-video");
    remoteVideo.srcObject = event.streams[0];
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { candidate: event.candidate });
    }
  };
}

// Handle socket events for updating user list
socket.on("update-user-list", (data) => {
  const userContainer = document.getElementById("active-user-container");
  userContainer.innerHTML = "";
  data.users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.innerText = user; // Add user name or ID
    userElement.onclick = () => {
      // Initiate call
      createPeerConnection();
      // Assume user clicked is the one to call
      socket.emit("offer", { offer: peerConnection.createOffer() });
    };
    userContainer.appendChild(userElement);
  });
});
