window.onload = function() {
  let intervalLength = 30; // The speed of the animation (milliseconds to wait between ticks).

  //for tracking border collisions.
  let maxX = 1;
  let maxY = 1;
  let maxZ = 1;
  let minX = -1;
  let minY = -1;
  let minZ = -1;

  //for tracking border color color timer.
  let topColorTimer = 0;
  let rightColorTimer = 0;
  let leftColorTimer = 0;
  let bottomColorTimer = 0;

  let myText = document.getElementById("myText");
  let mySphere = document.getElementById("mySphere");
  let leftBox = document.getElementById("leftBox");
  let rightBox = document.getElementById("rightBox");
  let topBox = document.getElementById("topBox");
  let bottomBox = document.getElementById("bottomBox");

  let mySpherePosition = {
    x: 0,
    y: 0,
    z: 0
  };
  // Create variables to track movement vectors.
  let mySphereVector = {
    x: 0,
    y: 0,
    z: 0
  };

  // Random number between 0.020 and 0.030 for both x and z vectors.
  //* Math.floor() returns the largest integer less than or equal to a given number.
  //* Math.random() random number in the range 0 to less than 1.
  mySphereVector.x = (Math.floor(Math.random() * 30) + 20) / 1000;
  mySphereVector.z = (Math.floor(Math.random() * 30) + 20) / 1000;

  // Timer for animations
  setInterval(() => {
    // Reset the colors of the Boxs.
    if (leftColorTimer > 0) {
      leftColorTimer = leftColorTimer - 1;
    } else {
      leftBox.setAttribute("color", "blue");
    }
    if (rightColorTimer > 0) {
      rightColorTimer = rightColorTimer - 1;
    } else {
      rightBox.setAttribute("color", "blue");
    }

    if (topColorTimer > 0) {
      topColorTimer = topColorTimer - 1;
    } else {
      topBox.setAttribute("color", "purple");
    }
    if (bottomColorTimer > 0) {
      bottomColorTimer = bottomColorTimer - 1;
    } else {
      bottomBox.setAttribute("color", "green");
    }

    // Move the sphere
    mySpherePosition.x = mySpherePosition.x + mySphereVector.x;
    mySpherePosition.y = mySpherePosition.y + mySphereVector.y;
    mySpherePosition.z = mySpherePosition.z + mySphereVector.z;
    mySphere.setAttribute(
      "position",
      mySpherePosition.x + " " + mySpherePosition.y + " " + mySpherePosition.z
    );

    // Update the text of the <span>.
    myText.textContent =
      "Ball Location: X = " +
      mySpherePosition.x.toFixed(2) +
      ", Y = " +
      mySpherePosition.y.toFixed(2) +
      ", Z = " +
      mySpherePosition.z.toFixed(2);

    // Detect collisions
    // If the sphere hits a boundary, then reverse it's vector.
    if (mySpherePosition.x >= maxX) {
      mySphereVector.x = mySphereVector.x * -1;
      rightBox.setAttribute("color", "yellow");
      rightColorTimer = 10;
      socket.emit("message", "right");
    }
    if (mySpherePosition.x <= minX) {
      mySphereVector.x = mySphereVector.x * -1;
      leftBox.setAttribute("color", "yellow");
      leftColorTimer = 10;
      socket.emit("message", "left");
    }
    /*if (mySpherePosition.y >= maxY) {
            //console.log("The ball bounced off the max Y border.")
            mySphereVector.y = mySphereVector.y * -1;
        }
        if (mySpherePosition.y <= minY) {
            //console.log("The ball bounced off the min Y border.")
            mySphereVector.y = mySphereVector.y * -1;
        }*/
    if (mySpherePosition.z >= maxZ) {
      mySphereVector.z = mySphereVector.z * -1;
      bottomBox.setAttribute("color", "red");
      bottomColorTimer = 10;
      socket.emit("message", "top");
    }
    if (mySpherePosition.z <= minZ) {
      mySphereVector.z = mySphereVector.z * -1;
      topBox.setAttribute("color", "red");
      topColorTimer = 10;
      socket.emit("message", "buttom");
    }
  }, intervalLength);
};
