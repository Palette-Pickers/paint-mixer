# Paint Mixer

A tool for natural media painters to help them build virtual palettes and experiment with "color recipes" using an accurate paint mixing engine. Combine paint colors to create new ones, and build the palette you need with the colors you already have. Created with React, TypeScript, Mixbox, tinycolor2, color-name-list, and Jest.

## Table of Contents

- [Paint Mixer](#paint-mixer)
  - [Table of Contents](#table-of-contents)
  - [Live Demo](#live-demo)
  - [Installation](#installation)
  - [Usage](#usage)
  - [How It Works](#how-it-works)
  - [Contributing](#contributing)
  - [License](#license)

## Live Demo

You can try out Paint Mixer without installing anything by visiting [paint-mixer.netlify.app](https://paint-mixer.netlify.app).

## Installation

Before you can install Paint Mixer, ensure you have [Node.js](https://nodejs.org/) installed on your machine. Then follow these steps:

1. Clone the repository to your local machine using:

    ```bash
    git clone https://github.com/your-username/paint-mixer.git
    ```

2. Navigate to the project directory:

    ```bash
    cd paint-mixer
    ```

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm start
    ```

Now, you should be able to access the Paint Mixer application at `http://localhost:3000` in your web browser.

## Usage

1. **Adding Colors to the Palette**:
   - Click on the `+` icon in the palette section to open the color picker.
   - Select the color you want to add to your palette and click `Confirm`.
   - The selected color will appear as a swatch in the palette section.

2. **Mixing Colors**:
   - Click on the swatches in the palette to increment the parts of each color you want to mix.
   - The mixed color will be displayed at the top of the screen.
   - You can adjust the parts of each color in the mix by clicking on the `+` or `-` icons on each swatch.

3. **Saving Mixed Colors**:
   - Once you've created a mix you like, click the `Save` button to add the mixed color to your palette.

4. **Setting a Target Color**:
   - Click the `Target` button to set a target color.
   - Select your target color using the color picker that appears.
   - The match percentage between the mixed color and the target color will be displayed.

5. **Resetting the Mix**:
   - Click the `Reset` button to reset the parts of each color in the mix to zero.

6. **Removing Colors from the Palette**:
   - Click the `x` icon on a swatch to remove that color from your palette.

## How It Works

Paint Mixer utilizes a combination of libraries and custom utility functions to simulate paint mixing. Here's a brief overview of how it works:

1. **Color Selection and Conversion**:
   - Colors are selected using a color picker, which returns colors in HSVa format.
   - These colors are then converted to RGBa format using the `hsvaToRgba` and `hsvaToRgbaString` functions from the `@uiw/color-convert` library.

2. **Color Mixing**:
   - The mixing engine uses the `mixbox` library to simulate the way paint mixes in the real world. Paints get their color from pigments, and mixbox predicts their mixing behavior by using the Kubelka–Munk model, not a simple subtractive color model.
   - Each color in the mix is converted to a latent color space, mixed according to the specified parts, and then converted back to RGBa format.

3. **Color Matching**:
   - The `deltaE94` function from the `colorConversion` utility is used to calculate the color difference between the mixed color and the target color.
   - This difference is then converted to a match percentage, which is displayed to the user.

4. **Palette Management**:
   - The palette is managed using the React state, with each color in the palette represented as an object containing its RGBa string, label, parts in the mix, and optionally a recipe of colors used to create it.

5. **Color Naming**:
   - The `fetchColorName` function is used to fetch a name for a color based on its hex value from the `color-name-list` library.

6. **Local Storage**:
   - The palette is saved to local storage, so it persists across browser sessions.

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
