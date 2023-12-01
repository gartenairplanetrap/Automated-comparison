const useSingleComparisonDownload = () => {
  const downloadFiles = (imageData, imageName, mismatchPercentage) => {
    // Download the image
    const downloadImage = () => {
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions to accommodate image and text
        canvas.width = img.width;
        canvas.height = img.height + 50; // Height for the text

        // Add text displaying the mismatch percentage above the image
        context.font = "20px Arial";
        context.fillStyle = "#333"; // Background color
        context.fillRect(0, 0, canvas.width, 50); // Background for text
        context.fillStyle = "white"; // Font color
        const mismatchText = `Mismatch: ${mismatchPercentage.toFixed(2)}%`;
        const textWidth = context.measureText(mismatchText).width;
        const textX = (canvas.width - textWidth) / 2; // Center horizontally
        const textY = 35; // Position above the image
        context.fillText(mismatchText, textX, textY);

        // Draw the image on the canvas after the text
        context.drawImage(img, 0, 50); // Adjust the Y position to leave space for text

        // Create a download link for the canvas image
        const downloadLink = document.createElement("a");
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = imageName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
    };

    // Download the Excel file

    // Function to handle click event for downloading both files
    const handleClick = () => {
      downloadImage();
    };

    return handleClick;
  };

  return downloadFiles;
};

export default useSingleComparisonDownload;
