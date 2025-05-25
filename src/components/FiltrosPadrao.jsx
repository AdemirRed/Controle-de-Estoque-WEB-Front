import React from 'react';
import { TextField, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

export default function FiltrosPadrao({
  busca, setBusca,
  buscaPeriodo, setBuscaPeriodo,
  statusFiltro, setStatusFiltro,
  exibirStatus = false,
  onLimpar,
  onHoje,
  onSemana,
  onMes
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      marginBottom: 24,
      alignItems: 'center',
      flexWrap: 'wrap',
      background: '#18243a',
      borderRadius: 8,
      padding: '16px 12px'
    }}>
      <TextField
        label="Buscar por Nº ou Nome"
        value={busca}
        onChange={e => setBusca(e.target.value)}
        size="small"
        sx={{ minWidth: 200, input: { color: '#fff' }, label: { color: '#fff' } }}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <DateRangePicker
          calendars={1}
          value={buscaPeriodo}
          onChange={setBuscaPeriodo}
          localeText={{ start: 'Início', end: 'Fim' }}
          slotProps={{
            textField: {
              size: 'small',
              sx: { minWidth: 160, input: { color: '#fff' }, label: { color: '#fff' } }
            }
          }}
          format="dd/MM/yyyy"
        />
      </LocalizationProvider>
      {exibirStatus && (
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ color: '#fff' }}>Status</InputLabel>
          <Select
            value={statusFiltro}
            label="Status"
            onChange={e => setStatusFiltro(e.target.value)}
            sx={{ color: '#fff' }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="aprovado">Aprovado</MenuItem>
            <MenuItem value="rejeitado">Rejeitado</MenuItem>
            <MenuItem value="entregue">Entregue</MenuItem>
          </Select>
        </FormControl>
      )}
      <Button
        variant="outlined"
        onClick={onHoje}
        sx={{ color: '#fff', borderColor: '#00f2fa' }}
      >
        Hoje
      </Button>
      <Button
        variant="outlined"
        onClick={onSemana}
        sx={{ color: '#fff', borderColor: '#00f2fa' }}
      >
        Semana
      </Button>
      <Button
        variant="outlined"
        onClick={onMes}
        sx={{ color: '#fff', borderColor: '#00f2fa' }}
      >
        Mês
      </Button>
      <Button
        variant="outlined"
        onClick={onLimpar}
        sx={{ color: '#fff', borderColor: '#00f2fa', ml: 2 }}
      >
        Limpar Filtros
      </Button>
    </div>
  );
}
