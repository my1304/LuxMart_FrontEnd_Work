import showAlert from "./AlertService";

const OpenAlert = (message, confirmText, cancelText) => {
  return showAlert(message, confirmText, cancelText); // Возвращает Promise
};

export default OpenAlert;

/* использование

    showAlert("Do you want to delete record " + categories.name + "?", "Yes", "No")
    .then((confirmed) => {
      if (confirmed) {
        alert("OK");
        console.log("Record deleted:", categories.name);
        // Логика удаления записи
      } else {
        alert("Cancelled");
        console.log("Deletion cancelled");
      }
    })
    .catch((error) => {
      console.error("Error showing alert:", error);
    });
    */