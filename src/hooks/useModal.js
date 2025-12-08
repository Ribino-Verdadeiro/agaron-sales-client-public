import { useCallback } from 'react';
import ModalService from '../services/ModalService';

export const useModal = () => {
  const showSuccess = useCallback((title, message, confirmButtonText = 'OK') => {
    return ModalService.success(title, message, confirmButtonText);
  }, []);

  const showError = useCallback((title, message, confirmButtonText = 'OK') => {
    return ModalService.error(title, message, confirmButtonText);
  }, []);

  const showConfirm = useCallback((title, text, confirmButtonText = 'Sim', cancelButtonText = 'Cancelar') => {
    return ModalService.confirm(title, text, confirmButtonText, cancelButtonText);
  }, []);

  const showLoading = useCallback((title = 'Carregando...') => {
    ModalService.loading(title);
  }, []);

  const closeModal = useCallback(() => {
    ModalService.close();
  }, []);

  return {
    showSuccess,
    showError,
    showConfirm,
    showLoading,
    closeModal,
    ModalService 
  };
};

export default useModal;