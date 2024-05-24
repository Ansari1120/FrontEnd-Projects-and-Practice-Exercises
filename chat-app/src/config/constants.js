export const getSender = (loggedUser, users) => {
  // console.log("loggedUser:", loggedUser);
  // console.log("users:", users);

  // Check if users array is defined and has at least two elements
  if (!Array.isArray(users) || users.length < 2) {
    // console.error("Invalid users array:", users);
    return; // Or handle the error in some appropriate way
  }

  // Check if _id property is defined for the users
  if (!users[0]._id || !users[1]._id) {
    // console.error("Missing _id property for users:", users);
    return; // Or handle the error in some appropriate way
  }

  // Check if loggedUser is defined
  if (!loggedUser) {
    // console.error("loggedUser is undefined");
    return; // Or handle the error in some appropriate way
  }

  // Assuming users array has at least two elements and _id property is defined for both users
  return users[0]._id === loggedUser ? users[1].name : users[0].name;
};

export const getSenderID = (loggedUser, users) => {
  // console.log("loggedUser:", loggedUser);
  // console.log("users:", users);

  // Check if users array is defined and has at least two elements
  if (!Array.isArray(users) || users.length < 2) {
    // console.error("Invalid users array:", users);
    return; // Or handle the error in some appropriate way
  }

  // Check if _id property is defined for the users
  if (!users[0]._id || !users[1]._id) {
    // console.error("Missing _id property for users:", users);
    return; // Or handle the error in some appropriate way
  }

  // Check if loggedUser is defined
  if (!loggedUser) {
    // console.error("loggedUser is undefined");
    return; // Or handle the error in some appropriate way
  }

  // Assuming users array has at least two elements and _id property is defined for both users
  return users[0]._id === loggedUser ? users[1]._id : users[0]._id;
};

export const getFullSender = (loggedUser, users) => {
  console.log("loggedUser:", loggedUser);
  console.log("users:", users);

  // Check if users array is defined and has at least two elements
  if (!Array.isArray(users) || users.length < 2) {
    // console.error("Invalid users array:", users);
    return; // Or handle the error in some appropriate way
  }

  // Check if _id property is defined for the users
  if (!users[0]._id || !users[1]._id) {
    // console.error("Missing _id property for users:", users);
    return; // Or handle the error in some appropriate way
  }

  // Check if loggedUser is defined
  if (!loggedUser) {
    // console.error("loggedUser is undefined");
    return; // Or handle the error in some appropriate way
  }

  // Assuming users array has at least two elements and _id property is defined for both users
  return users[0]._id === loggedUser ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getTimeAccordingToCondition = (apiDate) => {
  const currentDate = new Date();
  const apiDateTime = new Date(apiDate);

  if (!apiDate) {
    return null;
  }
  // Check if the current date matches the API date
  if (currentDate.toDateString() === apiDateTime.toDateString()) {
    return apiDateTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Check if the API date is one day back
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === apiDateTime.toDateString()) {
    return "Yesterday";
  }

  // Check if the API date is within two days back
  const twoDaysAgo = new Date(currentDate);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  if (apiDateTime >= twoDaysAgo) {
    return `${apiDateTime.getDate()}/${apiDateTime.getMonth() + 1}/${
      apiDateTime.getFullYear() % 100
    }`;
  }

  // Default case: Return the date
  return `${apiDateTime.getDate()}/${apiDateTime.getMonth() + 1}/${
    apiDateTime.getFullYear() % 100
  }`;
};
