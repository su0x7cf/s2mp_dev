
const generateTwoFactorCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789";
    let result = "";
    for(let i = 0; i < 6; i++){ 
        randomIndex = Math.floor(Math.random() * characters.length);
        result = result + characters.charAt(randomIndex);
    }
    return result;
}

module.exports = generateTwoFactorCode;
