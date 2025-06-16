import { useState, useEffect } from 'react';

export function useCurrencyInput() {
  const [displayValue, setDisplayValue] = useState('');
  const [rawValue, setRawValue] = useState('');

  // Função para formatar valor para exibição (formato brasileiro)
  const formatCurrency = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Para valores grandes, usar parseFloat em vez de parseInt
    const amount = parseFloat(numbers) / 100;
    
    // Formata para moeda brasileira sem símbolo R$
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para obter valor bruto (sem formatação)
  const getRawValue = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    
    const amount = parseFloat(numbers) / 100;
    return amount.toFixed(2).replace('.', ',');
  };

  // Função chamada quando o input muda
  const handleChange = (inputValue: string) => {
    const formatted = formatCurrency(inputValue);
    const raw = getRawValue(inputValue);
    
    setDisplayValue(formatted);
    setRawValue(raw);
  };



  return {
    displayValue,
    rawValue,
    handleChange,
    setDisplayValue,
    setRawValue,
  };
} 