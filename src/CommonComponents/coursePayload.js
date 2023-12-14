export const getCoursePayload = (data) => {
    return {
      name: data.get("name"),
      duration: data.get("duration"),
      fee: data.get("fee"),
    };
  };
  