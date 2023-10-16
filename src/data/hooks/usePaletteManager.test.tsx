import { render, act, fireEvent } from "@testing-library/react";
import usePaletteManager from "./usePaletteManager";
import { defaultPalette } from "../../utils/palettes/defaultPalette";
import React from 'react';

const TestComponent: React.FC = () => {
    const hookValues = usePaletteManager(defaultPalette);

    const {
        palette,
        handleSwatchIncrement,
        handleSwatchDecrement,
        handleRemoveFromPalette,
        resetPalette,
        addToPalette,
        updateColorName
    } = usePaletteManager(defaultPalette);

    const rgbString = "rgb(242, 117, 175)";

    return (
        <div>
            <div data-testid="hook-values">
                {JSON.stringify(palette)}
            </div>
            <button data-testid="increment-button" onClick={() => handleSwatchIncrement(0)}>Increment</button>
            <button data-testid="decrement-button" onClick={() => handleSwatchDecrement(0)}>Decrement</button>
            <button data-testid="remove-button" onClick={() => handleRemoveFromPalette(0)}>Remove</button>
            <button data-testid="reset-button" onClick={resetPalette}>Reset</button>
            <button data-testid="add-button" onClick={() => addToPalette("rgb(242,117,175)", false)}>Add</button>
            <input data-testid="color-name-input" defaultValue={palette[0]?.label || ""} />
            <button data-testid="update-name-button" onClick={() => updateColorName(0, "Updated Color")}>Update Name</button>
        </div>
    );

}

it("should increment partsInMix", () => {
    const {getByTestId} = render(<TestComponent />);

    act(() => {
        fireEvent.click(getByTestId("increment-button"));
    });

    const updatedPalette = JSON.parse(getByTestId("hook-values").textContent || "");
    expect(updatedPalette[0].partsInMix).toBe(1); // initial partsInMix was 0
});

it("should decrement partsInMix", () => {
    const {getByTestId} = render(<TestComponent />);

    act(() => {
        fireEvent.click(getByTestId("decrement-button"));
    });

    const updatedPalette = JSON.parse(getByTestId("hook-values").textContent || "");
    expect(updatedPalette[0].partsInMix).toBe(0);// initial partsInMix was 0
});

it("should remove a color from the palette", () => {
    const { getByTestId } = render(<TestComponent />);
    const initialPalette = JSON.parse(getByTestId("hook-values").textContent || "");

    act(() => {
        fireEvent.click(getByTestId("remove-button"));
    });

    const updatedPalette = JSON.parse(getByTestId("hook-values").textContent || "");
    expect(updatedPalette.length).toBe(initialPalette.length - 1);
});

it("should reset the palette", () => {
    const { getByTestId } = render(<TestComponent />);

    act(() => {
        fireEvent.click(getByTestId("reset-button"));
    });

    const updatedPalette = JSON.parse(getByTestId("hook-values").textContent || "");
    updatedPalette.forEach(color => {
        expect(color.partsInMix).toBe(0);
    });
});

it("should add a color to the palette", () => {
    const { getByTestId } = render(<TestComponent />);
    const initialPaletteLength = JSON.parse(getByTestId("hook-values").textContent || "").length;

    act(() => {
        fireEvent.click(getByTestId("add-button"));
    });

    const updatedPalette = JSON.parse(getByTestId("hook-values").textContent || "");

    // If you have a default name for new colors, you can check it here:
    expect(updatedPalette[updatedPalette.length - 1].label).toBe("New Color");
});