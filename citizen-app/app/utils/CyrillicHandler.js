export function handleCyrillicInput(field, e) {
    var charCode = e.getCharCode();
    // Проверяем, является ли символ кириллическим и не является ли числом или специальным символом
    if ((charCode >= 1040 && charCode <= 1103) || charCode === 1025 || charCode === 1105) {
        // Преобразуем символ в верхний регистр
        var char = String.fromCharCode(charCode).toUpperCase();
        // Заменяем значение поля на преобразованный символ
        field.setValue(char);
    } else {
        // Если введен символ, который не является кириллицей, отменяем событие ввода
        e.stopEvent();
    }
}