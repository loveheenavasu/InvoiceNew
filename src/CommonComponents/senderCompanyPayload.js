export const getsenderCompanyPayload = (data) => {
  return {
    name: data.get("name"),
    location: data.get("address"),
    phone: data.get("phone"),
    pan: data.get("pan_number"),
    cin: data.get("cin"),
    gstin: data.get("gstin"),
    bank_name: data.get("bank_name"),
    bank_account_holder_name: data.get("acc_holder"),
    bank_account_no: data.get("acc_number"),
    bank_ifsc_code: data.get("ifsc"),
    email: data.get("email"),
  };
};
