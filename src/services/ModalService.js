import Swal from 'sweetalert2';

class ModalService {
  static success(title, message, confirmButtonText = 'OK') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#3085d6',
    });
  }

  static error(title, message, confirmButtonText = 'OK') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#d33',
    });
  }

  static warning(title, message, confirmButtonText = 'OK') {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#f59e0b',
    });
  }

  static info(title, message, confirmButtonText = 'OK') {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#3b82f6',
    });
  }

  static confirm(title, text, confirmButtonText = 'Sim', cancelButtonText = 'Cancelar') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    });
  }

  static loading(title = 'Carregando...') {
    Swal.fire({
      title: title,
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  static close() {
    Swal.close();
  }

  static custom(config) {
    return Swal.fire(config);
  }
}

export default ModalService;