import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as useUpdateChosenQuantityModule from '../src/common/hooks/use-update-chosen-quantity';
import CharacterCard from '../src/common/components/CharacterCard';

describe('CharacterCard component', () => {
  beforeEach(() => {
    jest
      .spyOn(useUpdateChosenQuantityModule, 'useUpdateChosenQuantity')
      .mockReturnValue({
        onIncreaseChosenQuantity: jest.fn(),
        onDecreaseChosenQuantity: jest.fn(),
      });
  });
  it('should render', () => {
    const wrapper = render(<CharacterCard data={mockData} />);
    expect(wrapper).toBeTruthy();
  });
  it('should call onIncreaseChosenQuantity and onDecreaseChosenQuantity on press', () => {
    const mockOnIncreaseChosenQuantity = jest.fn();
    const mockOnDecreaseChosenQuantity = jest.fn();
    jest
      .spyOn(useUpdateChosenQuantityModule, 'useUpdateChosenQuantity')
      .mockReturnValue({
        onIncreaseChosenQuantity: mockOnIncreaseChosenQuantity,
        onDecreaseChosenQuantity: mockOnDecreaseChosenQuantity,
      });
    const wrapper = render(<CharacterCard data={mockData} />);
    fireEvent.press(wrapper.getByTestId('charactter-remove-btn'));
    fireEvent.press(wrapper.getByTestId('charactter-add-btn'));
    expect(mockOnIncreaseChosenQuantity).toBeCalled();
    expect(mockOnDecreaseChosenQuantity).toBeCalled();
  });
});

const mockData = {
  id: 'any_id',
  image: 'any_image',
  name: 'any_name',
  unitPrice: 10,
  chosenQuantity: 0,
};
