import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal } from 'react-native';
import styled from 'styled-components/native';

interface ComparisonTutorialProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

const TutorialOverlay = styled.View<{ theme: any }>`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const TutorialCard = styled.View<{ theme: any }>`
  background-color: ${props => props.theme.colors.background};
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 380px;
  margin-horizontal: 16px;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.3;
  shadow-radius: 20px;
  elevation: 10;
`;

const TutorialTitle = styled.Text<{ theme: any }>`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 12px;
  flex-shrink: 1;
`;

const TutorialStep = styled.View`
  margin-bottom: 25px;
`;

const StepNumber = styled.View<{ theme: any }>`
  background-color: ${props => props.theme.colors.primary};
  width: 30px;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const StepNumberText = styled.Text<{ theme: any }>`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const StepTitle = styled.Text<{ theme: any }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const StepDescription = styled.Text<{ theme: any }>`
  font-size: 14px;
  color: ${props => props.theme.colors.gray700};
  line-height: 20px;
  flex-shrink: 1;
`;

const StepIcon = styled.View<{ theme: any }>`
  background-color: ${props => props.theme.colors.gray100};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
`;

const TutorialButton = styled.TouchableOpacity<{ theme: any; variant?: 'primary' | 'secondary' }>`
  background-color: ${props => 
    props.variant === 'primary' 
      ? props.theme.colors.primary 
      : props.theme.colors.gray300
  };
  padding: 12px 24px;
  border-radius: 20px;
  flex: 1;
  min-height: 44px;
  max-width: 140px;
  min-width: 100px;
`;

const ButtonText = styled.Text<{ theme: any; variant?: 'primary' | 'secondary' }>`
  color: ${props => 
    props.variant === 'primary' 
      ? 'white' 
      : props.theme.colors.text
  };
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  flex-shrink: 1;
`;

const SkipButton = styled.TouchableOpacity`
  align-self: center;
  margin-top: 15px;
`;

const SkipText = styled.Text<{ theme: any }>`
  color: ${props => props.theme.colors.gray500};
  font-size: 14px;
  text-decoration-line: underline;
`;

export default function ComparisonTutorial({ visible, onClose, onComplete, onSkip }: ComparisonTutorialProps) {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  // Reset tutorial quando for aberto
  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
    }
  }, [visible]);

  const steps = [
    {
      title: 'Toque Longo na Foto',
      description: 'Mantenha pressionado uma foto por alguns segundos para ativar o modo de seleção múltipla.',
      icon: 'finger-print-outline',
    },
    {
      title: 'Selecione a Segunda Foto',
      description: 'Toque na segunda foto que deseja comparar. Agora você terá 2 fotos selecionadas.',
      icon: 'images-outline',
    },
    {
      title: 'Compare as Fotos',
      description: 'Toque no botão "Comparar Fotos" que aparecerá na barra inferior para ver a comparação lado a lado.',
      icon: 'git-compare-outline',
    },
    {
      title: 'Analise os Resultados',
      description: 'Veja as diferenças de tempo, localização, tamanho e outras métricas entre as duas fotos.',
      icon: 'analytics-outline',
    },
    {
      title: 'Sair do Modo de Seleção',
      description: 'Use o botão "Cancelar" na barra inferior para sair do modo de seleção e voltar ao modo normal.',
      icon: 'close-circle-outline',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0); // Reset para o primeiro passo
      onClose();
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Pular Tutorial',
      'Tem certeza que deseja pular o tutorial? Você será redirecionado para a galeria.',
      [
        { text: 'Continuar Tutorial', style: 'cancel' },
        { 
          text: 'Pular', 
          style: 'destructive', 
          onPress: () => {
            setCurrentStep(0); // Reset para o primeiro passo
            onClose();
            if (onSkip) {
              onSkip();
            }
          }
        },
      ]
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TutorialOverlay theme={theme}>
        <TutorialCard theme={theme}>
          <TutorialTitle theme={theme}>
            📊 Como Comparar Fotos
          </TutorialTitle>

          <TutorialStep>
            <StepNumber theme={theme}>
              <StepNumberText theme={theme}>
                {currentStep + 1}
              </StepNumberText>
            </StepNumber>

            <StepIcon theme={theme}>
              <Ionicons 
                name={currentStepData.icon as any} 
                size={24} 
                color={theme.colors.primary} 
              />
            </StepIcon>

            <StepTitle theme={theme}>
              {currentStepData.title}
            </StepTitle>

            <StepDescription theme={theme}>
              {currentStepData.description}
            </StepDescription>
          </TutorialStep>

          <ButtonContainer>
            {currentStep > 0 && (
              <TutorialButton 
                theme={theme} 
                variant="secondary"
                onPress={handlePrevious}
                style={{ flex: 1 }}
              >
                <ButtonText theme={theme} variant="secondary">
                  Anterior
                </ButtonText>
              </TutorialButton>
            )}

            <TutorialButton 
              theme={theme} 
              variant="primary"
              onPress={handleNext}
              style={{ 
                flex: currentStep === 0 ? 1 : 1,
                maxWidth: currentStep === 0 ? '100%' : '140px'
              }}
            >
              <ButtonText theme={theme} variant="primary">
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              </ButtonText>
            </TutorialButton>
          </ButtonContainer>

          <SkipButton onPress={handleSkip}>
            <SkipText theme={theme}>
              Pular tutorial
            </SkipText>
          </SkipButton>
        </TutorialCard>
      </TutorialOverlay>
    </Modal>
  );
}
