import figlet from 'figlet';
import { rawlist } from '@inquirer/prompts';

jest.mock('figlet', () => ({
  textSync: jest.fn().mockReturnValue('Mocked MarketPlacer Code Challenge!'),
}));

jest.mock('@inquirer/prompts', () => ({
  rawlist: jest.fn(),
}));

describe('Entry Point', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log welcome display ', () => {
    (rawlist as jest.Mock).mockResolvedValueOnce('exit');
    require('./index');

    expect(figlet.textSync).toHaveBeenCalledWith(
      'MarketPlacer Code Challenge!'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Mocked MarketPlacer Code Challenge!'
    );
  });
});
