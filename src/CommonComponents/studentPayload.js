export const getStudentPayload = (data) => {
    return {
      name: data.get("name"),
      email: data.get("email"),
      phone: Number(data.get("phone")),
      address: data.get("address"),
    };
  };
  