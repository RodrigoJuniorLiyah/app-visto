import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, Modal, Platform } from 'react-native';
import styled from 'styled-components/native';

interface DateFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  selectedDateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View<{ theme: any }>`
  background-color: ${(props: any) => props.theme.colors.background === '#1A1A1A' ? '#2A2A2A' : props.theme.colors.white};
  border-radius: 20px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.3;
  shadow-radius: 20px;
  elevation: 10;
`;

const ModalTitle = styled.Text<{ theme: any }>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: any) => props.theme.colors.text};
  text-align: center;
  margin-bottom: 20px;
`;

const DateSection = styled.View`
  margin-bottom: 20px;
`;

const DateLabel = styled.Text<{ theme: any }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: any) => props.theme.colors.text};
  margin-bottom: 8px;
`;

const DateButton = styled.TouchableOpacity<{ theme: any; isSelected?: boolean }>`
  background-color: ${(props: any) => 
    props.isSelected 
      ? props.theme.colors.primary 
      : props.theme.colors.background === '#1A1A1A' ? '#3A3A3A' : props.theme.colors.gray100
  };
  border-radius: 12px;
  padding: 12px 16px;
  border-width: 1px;
  border-color: ${(props: any) => 
    props.isSelected 
      ? props.theme.colors.primary 
      : props.theme.colors.gray200
  };
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DateButtonText = styled.Text<{ theme: any; isSelected?: boolean }>`
  color: ${(props: any) => 
    props.isSelected 
      ? 'white' 
      : props.theme.colors.text
  };
  font-size: 14px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
`;

const ModalButton = styled.TouchableOpacity<{ theme: any; variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  background-color: ${(props: any) => 
    props.variant === 'primary' 
      ? props.theme.colors.primary 
      : props.theme.colors.gray300
  };
`;

const ModalButtonText = styled.Text<{ theme: any; variant: 'primary' | 'secondary' }>`
  color: ${(props: any) => 
    props.variant === 'primary' 
      ? 'white' 
      : props.theme.colors.text
  };
  font-weight: 600;
  text-align: center;
`;

const ClearButton = styled.TouchableOpacity<{ theme: any }>`
  background-color: ${(props: any) => props.theme.colors.danger};
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const ClearButtonText = styled.Text`
  color: white;
  font-weight: 600;
  text-align: center;
`;

export default function DateFilterModal({ 
  visible, 
  onClose, 
  onDateRangeChange, 
  selectedDateRange 
}: DateFilterModalProps) {
  const { theme } = useTheme();
  const [tempStartDate, setTempStartDate] = useState<Date | null>(selectedDateRange.startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(selectedDateRange.endDate);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleApply = () => {
    if (tempStartDate && tempEndDate && tempStartDate > tempEndDate) {
      Alert.alert('Data Inválida', 'A data inicial não pode ser posterior à data final.');
      return;
    }
    
    if (tempStartDate && tempStartDate > new Date()) {
      Alert.alert('Data Inválida', 'A data inicial não pode ser futura.');
      return;
    }
    
    if (tempEndDate && tempEndDate > new Date()) {
      Alert.alert('Data Inválida', 'A data final não pode ser futura.');
      return;
    }
    
    onDateRangeChange(tempStartDate, tempEndDate);
    onClose();
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onDateRangeChange(null, null);
    onClose();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Selecionar data';
    return date.toLocaleDateString('pt-BR');
  };

  const handleStartDatePress = () => {
    setShowStartDatePicker(true);
  };

  const handleEndDatePress = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        Alert.alert('Data Inválida', 'Não é possível selecionar uma data futura.');
        return;
      }
      
      if (tempEndDate && selectedDate > tempEndDate) {
        Alert.alert('Data Inválida', 'A data inicial não pode ser posterior à data final.');
        return;
      }
      
      setTempStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        Alert.alert('Data Inválida', 'Não é possível selecionar uma data futura.');
        return;
      }
      
      if (tempStartDate && selectedDate < tempStartDate) {
        Alert.alert('Data Inválida', 'A data final não pode ser anterior à data inicial.');
        return;
      }
      
      setTempEndDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ModalContent theme={theme}>
            <ModalTitle theme={theme}>Filtrar por Data</ModalTitle>

            <ClearButton theme={theme} onPress={handleClear}>
              <ClearButtonText>Limpar Filtros</ClearButtonText>
            </ClearButton>

          <DateSection>
            <DateLabel theme={theme}>Data Inicial</DateLabel>
            <DateButton 
              theme={theme} 
              isSelected={!!tempStartDate}
              onPress={handleStartDatePress}
            >
              <DateButtonText theme={theme} isSelected={!!tempStartDate}>
                {formatDate(tempStartDate)}
              </DateButtonText>
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={tempStartDate ? 'white' : theme.colors.gray500} 
                style={{ marginLeft: 8 }}
              />
            </DateButton>
          </DateSection>

          <DateSection>
            <DateLabel theme={theme}>Data Final</DateLabel>
            <DateButton 
              theme={theme} 
              isSelected={!!tempEndDate}
              onPress={handleEndDatePress}
            >
              <DateButtonText theme={theme} isSelected={!!tempEndDate}>
                {formatDate(tempEndDate)}
              </DateButtonText>
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={tempEndDate ? 'white' : theme.colors.gray500} 
                style={{ marginLeft: 8 }}
              />
            </DateButton>
          </DateSection>

          <ButtonContainer>
            <ModalButton theme={theme} variant="secondary" onPress={onClose}>
              <ModalButtonText theme={theme} variant="secondary">Cancelar</ModalButtonText>
            </ModalButton>
            
            <ModalButton theme={theme} variant="primary" onPress={handleApply}>
              <ModalButtonText theme={theme} variant="primary">Aplicar</ModalButtonText>
            </ModalButton>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={tempStartDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
          locale="pt-BR"
          maximumDate={new Date()} // Não permite datas futuras
          minimumDate={new Date(2020, 0, 1)} // Data mínima: 1º de janeiro de 2020
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={tempEndDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
          locale="pt-BR"
          maximumDate={new Date()} // Não permite datas futuras
          minimumDate={tempStartDate || new Date(2020, 0, 1)} // Data mínima: data inicial ou 2020
        />
      )}
    </Modal>
  );
}
