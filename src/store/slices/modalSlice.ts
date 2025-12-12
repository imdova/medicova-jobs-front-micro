import { ModalState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ModalState = {
  isOpen: false,
  message: '',
  buttons: [],
  navigationUrl: undefined
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<Omit<ModalState, 'isOpen'>>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.buttons = action.payload.buttons;
      state.navigationUrl = action.payload.navigationUrl;
    },
    hideModal: (state) => {
      state.isOpen = false;
      state.message = '';
      state.buttons = [];
      state.navigationUrl = undefined;
    }
  }
});

export const { showModal, hideModal } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;

