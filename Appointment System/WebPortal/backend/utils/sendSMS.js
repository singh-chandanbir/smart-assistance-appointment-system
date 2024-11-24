const sendSMS = async (content, to) => {
    console.log(content);
    const apiKey = process.env.HTTP_SMS_API_KEY;
    const from = process.env.HTTP_SMS_FROM;
    if (to === from) {
      return {
        status: 200,
        message: "Cannot send SMS to self",
      };
    }
  
    const response = await fetch("https://api.httpsms.com/v1/messages/send", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        from: from,
        to: to,
      }),
    });
  
    return response;
  };
  export { sendSMS };