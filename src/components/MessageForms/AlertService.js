import styles from "../../styles/CustomBank.module.css";

const showAlert = (message, Key1, Key2) => {
  return new Promise((resolve) => {
    const handleResponse = (response) => {
      // Удаляем модалку из DOM после ответа
      const alertContainer = document.getElementById("alert-container");
      if (alertContainer) {
        alertContainer.remove();
      }
      resolve(response); // Возвращаем результат (true или false)
    };

    // Создаем контейнер для модалки
    const alertContainer = document.createElement("div");
    alertContainer.id = "alert-container";
    document.body.appendChild(alertContainer);

    // Рендерим модалку
    alertContainer.innerHTML = `
      <div class="${styles.overlay}">
        <div class="${styles.dialogBox}">
          <div class="${styles.titleBar}">
            <button class="${styles.closeBtn}" id="close-button">&times;</button>
          </div>
          <div class="${styles.contentArea}">
            <h2 class="${styles.alertText}">${message}</h2>
            <div class="${styles.buttonGroup}">
              <button class="${styles.okBtn}" id="ok-button">${Key1}</button>
              <button class="${styles.cancelBtn}" id="cancel-button">${Key2}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Добавляем обработчики событий
    document.getElementById("ok-button").addEventListener("click", () => handleResponse(true));
    document.getElementById("cancel-button").addEventListener("click", () => handleResponse(false));
    document.getElementById("close-button").addEventListener("click", () => handleResponse(false));
  });
};

export default showAlert;