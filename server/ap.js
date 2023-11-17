const sharp = require("sharp");

// Load the original image
sharp("path/to/original/image.jpg")
  .extract({ left: 100, top: 100, width: 200, height: 150 }) // Define the area to cover
  .toBuffer()
  .then((croppedImage) => {
    // Create a buffer with a solid color (in this case, red)
    const solidColor = Buffer.from([255, 0, 0, 128]); // RGBA value for red with 50% opacity

    // Overlay the solid color onto the cropped area
    sharp(croppedImage)
      .overlayWith(solidColor, { gravity: sharp.gravity.northwest }) // Adjust gravity as needed
      .toFile("path/to/covered/image.jpg", (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Image covered with color using Sharp!");
        }
      });
  })
  .catch((err) => {
    console.error(err);
  });
