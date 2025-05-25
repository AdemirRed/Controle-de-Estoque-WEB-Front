import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 0;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  width: 100%;
  box-sizing: border-box;
  background-color: #0a1929;
  color: #f3f6f9;

  @media (max-width: 900px) {
    padding: 10px 2vw;
    margin-top: 56px;
  }
`;

export const FormWrapper = styled.div`
  background: #132040;
  padding: 32px 32px 24px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.25);
  width: 100%;
  box-sizing: border-box;
  color: #f3f6f9;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 600px;
  margin: 0 auto;

  .MuiInputBase-root,
  .MuiOutlinedInput-root,
  .MuiSelect-select,
  .MuiInputLabel-root,
  .MuiFormLabel-root {
    color: #f3f6f9 !important;
    background: #1a2636 !important;
    border-radius: 6px !important;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: #00f2fa !important;
  }

  .Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #00f2fa !important;
    box-shadow: 0 0 0 2px #00f2fa33;
  }

  .MuiInputLabel-root {
    color: #b2bac2 !important;
  }

  .MuiInputBase-input {
    color: #f3f6f9 !important;
  }

  .MuiSelect-icon {
    color: #00f2fa !important;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const PedidoCard = styled.div`
  border: 1px solid #00f2fa33;
  background: #132040;
  color: #f3f6f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 0 15px #00f2fa22;
`;

export const ListaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EditModeContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #00f2fa33;
  border-radius: 8px;
  background: #1a2636;
`;

// Detalhes
export const DetailsContainer = styled.div`
  background: #132040;
  padding: 32px;
  border-radius: 12px;
  color: #f3f6f9;
`;

export const DetailsHeader = styled.h2`
  color: #00f2fa;
  margin-bottom: 24px;
  border-bottom: 1px solid #00f2fa33;
  padding-bottom: 8px;
`;

export const DetailsRow = styled.div`
  display: flex;
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #22304a;
`;

export const DetailsLabel = styled.span`
  font-weight: bold;
  min-width: 150px;
  color: #b2bac2;
`;

export const DetailsValue = styled.span`
  flex: 1;
  color: #f3f6f9;
`;
