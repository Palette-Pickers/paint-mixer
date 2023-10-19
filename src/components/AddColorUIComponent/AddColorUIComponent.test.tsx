import React from "react"
import { render, fireEvent } from "@testing-library/react"
import AddColorUIComponent from "./AddColorUIComponent"
import '@testing-library/jest-dom';


describe("<AddColorUIComponent />", () => {
	let mockSetShowAddColorPicker, mockSetAddColor, mockConfirmColor

	beforeEach(() => {
		mockSetShowAddColorPicker = jest.fn()
		mockSetAddColor = jest.fn()
		mockConfirmColor = jest.fn()
	})

	it("renders without crashing", () => {
		render(
			<AddColorUIComponent showAddColorPicker={false} addColor="#FFFFFF" setShowAddColorPicker={mockSetShowAddColorPicker}
			setAddColor={mockSetAddColor} confirmColor={mockConfirmColor} />)
		})

		it("shows the color picker when the button is clicked", () => {
			const { getByRole } = render(
				<AddColorUIComponent
					showAddColorPicker={false}
					addColor="#FFBBFF"
					setShowAddColorPicker={mockSetShowAddColorPicker}
					setAddColor={mockSetAddColor}
					confirmColor={mockConfirmColor}
				/>
			)

			const colorPicker = getByRole('a');

			fireEvent.click(colorPicker)

			expect(mockSetShowAddColorPicker).toHaveBeenCalledWith(true)
		})

		it('should display the color picker when showAddColorPicker is true', () => {
		const { getByTestId } = render(
			<AddColorUIComponent
				showAddColorPicker={true}
				addColor="#FFFFFF" // provide a default color for testing
				setShowAddColorPicker={() => {}}
				setAddColor={() => {}}
				confirmColor={() => {}}
			/>
		);

		// Assuming you add a "data-testid" attribute to your color picker container
		const colorPickerContainer = getByTestId('colorPickerContainer');
		expect(colorPickerContainer).toBeInTheDocument();
	});

		it('should not display the color picker when showAddColorPicker is false', () => {
			const { queryByTestId } = render(
				<AddColorUIComponent
					showAddColorPicker={false}
					addColor="#FFFFFF" // provide a default color for testing
					setShowAddColorPicker={() => {}}
					setAddColor={() => {}}
					confirmColor={() => {}}
				/>
			);

			// Assuming you add a "data-testid" attribute to your color picker container
			const colorPickerContainer = queryByTestId('color-picker-container');
			expect(colorPickerContainer).not.toBeInTheDocument();
		});


		it('changes the color when a new color is selected in the color picker', () => {
			const { getByRole } = render(<AddColorUIComponent
				showAddColorPicker={true}
				addColor="#FFFFFF"
				setShowAddColorPicker={mockSetShowAddColorPicker}
				setAddColor={mockSetAddColor}
				confirmColor={mockConfirmColor}
				/>);

			const colorPicker = getByRole('colorpicker');
			fireEvent.change(colorPicker, { target: { value: '#FF0000' } });

			expect(mockSetAddColor).toHaveBeenCalledWith('#FF0000');
		});

		it('calls the confirm function when the color is confirmed', () => {
			const { getByText } = render(<AddColorUIComponent
				showAddColorPicker={true}
				addColor="#FFFFFF"
				setShowAddColorPicker={mockSetShowAddColorPicker}
				setAddColor={mockSetAddColor}
				confirmColor={mockConfirmColor}
				/>);

				const confirmButton = getByText('OK');  // Assuming the button has the text "Confirm"
				fireEvent.click(confirmButton);

				expect(mockConfirmColor).toHaveBeenCalled();
			});
		})
