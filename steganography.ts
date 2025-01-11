// Steganography utility functions
export function textToBinary(text: string): string {
  return text.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
}

export function hideMessage(imageData: ImageData, binaryMessage: string): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const maxMessageLength = Math.floor((data.length * 3) / 8); // 3 color channels per pixel

  if (binaryMessage.length > maxMessageLength) {
    throw new Error(`Message too long. Maximum length is ${maxMessageLength} bits`);
  }

  // Store message length at the beginning (32 bits)
  const messageLengthBinary = binaryMessage.length.toString(2).padStart(32, '0');
  let bitIndex = 0;

  // Hide message length
  for (let i = 0; i < 32; i++) {
    const bit = parseInt(messageLengthBinary[i]);
    data[bitIndex] = (data[bitIndex] & 0xFE) | bit;
    bitIndex++;
  }

  // Hide message
  for (let i = 0; i < binaryMessage.length; i++) {
    const bit = parseInt(binaryMessage[i]);
    data[bitIndex] = (data[bitIndex] & 0xFE) | bit;
    bitIndex++;
  }

  return new ImageData(data, imageData.width, imageData.height);
}

export function extractMessage(imageData: ImageData): string {
  const data = imageData.data;
  
  // Extract message length
  let lengthBinary = '';
  for (let i = 0; i < 32; i++) {
    lengthBinary += data[i] & 1;
  }
  const messageLength = parseInt(lengthBinary, 2);

  // Extract message
  let binaryMessage = '';
  for (let i = 32; i < 32 + messageLength; i++) {
    binaryMessage += data[i] & 1;
  }

  // Convert binary to text
  let text = '';
  for (let i = 0; i < binaryMessage.length; i += 8) {
    const byte = binaryMessage.substr(i, 8);
    text += String.fromCharCode(parseInt(byte, 2));
  }

  return text;
}