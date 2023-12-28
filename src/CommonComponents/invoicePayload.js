export const getInvoicePayload = (data) => {
  const formData = new FormData();

  formData.append('selectedStudent', data.selectedStudent);
  formData.append('selectedDuration', data.selectedDuration);
  formData.append('selectedCourse', data.selectedCourse);
  formData.append('selectedCourseFee', data.selectedCourseFee);
  formData.append('depositeAmount', data.depositeAmount);
  formData.append('pendingAmount', data.pendingAmount);
  formData.append('paymentMethod', data.paymentMethod);

  return formData;
};
