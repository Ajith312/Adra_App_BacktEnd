import fetch from "node-fetch"; 


export const sendNotification = async (token, title, body) => {
  const expoPushUrl = "https://exp.host/--/api/v2/push/send";
  const message = {
    to: token, 
    sound: "default",
    title: title,
    body: body,
  };

  try {
    const response = await fetch(expoPushUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();
    console.log("Notification Sent Successfully:", responseData);
  } catch (error) {
    console.error("Error Sending Notification:", error);
  }
};
