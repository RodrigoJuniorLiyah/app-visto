import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTORIAL_KEY = 'comparison_tutorial_completed';

export class TutorialService {
  private static instance: TutorialService;

  private constructor() {}

  public static getInstance(): TutorialService {
    if (!TutorialService.instance) {
      TutorialService.instance = new TutorialService();
    }
    return TutorialService.instance;
  }

  public async hasSeenComparisonTutorial(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(TUTORIAL_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Erro ao verificar tutorial:', error);
      return false;
    }
  }

  public async markComparisonTutorialAsSeen(): Promise<void> {
    try {
      await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
    } catch (error) {
      console.error('Erro ao marcar tutorial como visto:', error);
    }
  }

  public async resetComparisonTutorial(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TUTORIAL_KEY);
    } catch (error) {
      console.error('Erro ao resetar tutorial:', error);
    }
  }

  public async shouldShowComparisonTutorial(): Promise<boolean> {
    const hasSeen = await this.hasSeenComparisonTutorial();
    return !hasSeen;
  }
}
